import { createFreebuffAuth, isSameOriginRequest } from "@freebuff/auth";

const SERVICE_ID = /^[a-z0-9-]{1,40}$/;
const VOTER_ID = /^[a-z0-9]{8,40}$/;

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS favorites (
     user_id TEXT NOT NULL,
     service_id TEXT NOT NULL,
     created_at TEXT NOT NULL DEFAULT (datetime('now')),
     PRIMARY KEY (user_id, service_id)
   )`,
  `CREATE INDEX IF NOT EXISTS favorites_user_idx ON favorites (user_id)`,
  `CREATE TABLE IF NOT EXISTS visits (
     day TEXT PRIMARY KEY,
     count INTEGER NOT NULL DEFAULT 0
   )`,
  `CREATE TABLE IF NOT EXISTS ratings (
     service_id TEXT NOT NULL,
     voter TEXT NOT NULL,
     stars INTEGER NOT NULL,
     created_at TEXT NOT NULL DEFAULT (datetime('now')),
     PRIMARY KEY (service_id, voter)
   )`,
  `CREATE INDEX IF NOT EXISTS ratings_service_idx ON ratings (service_id)`,
];

function todayUTC() {
  return new Date().toISOString().slice(0, 10);
}

async function visitStats(db) {
  const day = todayUTC();
  const total = await db.prepare("SELECT COALESCE(SUM(count), 0) AS n FROM visits").first();
  const today = await db.prepare("SELECT count FROM visits WHERE day = ?").bind(day).first();
  return { total: (total && total.n) || 0, today: (today && today.count) || 0, day };
}

let auth;
let app;
let schemaReady;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "private, no-store",
    },
  });
}

function ensureSchema(db) {
  if (!schemaReady) {
    schemaReady = (async () => {
      for (const sql of SCHEMA) await db.prepare(sql).run();
    })().catch((err) => {
      schemaReady = undefined;
      throw err;
    });
  }
  return schemaReady;
}

// Average stars per service. One vote per browser, changeable later.
async function ratingSummary(db, serviceId) {
  const sql =
    "SELECT service_id, COUNT(*) AS count, AVG(stars) AS avg FROM ratings" +
    (serviceId ? " WHERE service_id = ?" : "") +
    " GROUP BY service_id";
  const stmt = serviceId ? db.prepare(sql).bind(serviceId) : db.prepare(sql);
  const { results } = await stmt.all();
  const out = {};
  for (const row of results || []) {
    out[row.service_id] = { avg: Math.round(row.avg * 10) / 10, count: row.count };
  }
  return out;
}

async function listFavorites(db, userId) {
  const { results } = await db
    .prepare("SELECT service_id FROM favorites WHERE user_id = ? ORDER BY created_at, service_id")
    .bind(userId)
    .all();
  return (results || []).map((row) => row.service_id);
}

function setup(env) {
  // One auth instance per isolate: caches OIDC discovery and signing keys.
  if (!auth) {
    // Loopback development is the only place plain http is allowed.
    const loopback = /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])([:/]|$)/.test(
      env.APP_ORIGIN || ""
    );
    auth = createFreebuffAuth({
      clientId: env.FREEBUFF_CLIENT_ID,
      issuer: env.FREEBUFF_ISSUER,
      baseUrl: env.APP_ORIGIN,
      allowInsecureLocalhost: loopback,
    });
  }
  const signed = auth;

  if (!app) {
    app = signed.wrap(async (request, env) => {
      const url = new URL(request.url);
      const path = url.pathname;

      // Country hint for language selection (nothing stored, no external API).
      if (path === "/api/geo") {
        const country = (request.cf && request.cf.country) || "";
        const continent = (request.cf && request.cf.continent) || "";
        return json({ country, continent });
      }

      // Who is signed in? Display only; every data route checks again.
      if (path === "/api/me") {
        const user = await signed.getUser(request);
        return json({ user: user || null });
      }

      // Public visit counter: no cookies and nothing personal stored.
      if (path === "/api/visits" || path === "/api/visit") {
        const db = env.DB;
        if (!db) return json({ error: "unavailable" }, 503);
        await ensureSchema(db);

        if (path === "/api/visit") {
          if (request.method !== "POST") return new Response(null, { status: 405 });
          if (!isSameOriginRequest(request, env.APP_ORIGIN)) {
            return new Response(null, { status: 403 });
          }
          await db
            .prepare(
              "INSERT INTO visits (day, count) VALUES (?, 1) " +
                "ON CONFLICT(day) DO UPDATE SET count = count + 1"
            )
            .bind(todayUTC())
            .run();
        } else if (request.method !== "GET") {
          return new Response(null, { status: 405 });
        }

        return json(await visitStats(db));
      }

      // Visitor ratings: public averages, same-origin votes, nothing personal stored.
      if (path === "/api/ratings" || path.startsWith("/api/ratings/")) {
        const db = env.DB;
        if (!db) return json({ error: "unavailable" }, 503);
        await ensureSchema(db);

        if (request.method === "GET" && path === "/api/ratings") {
          return json({ ratings: await ratingSummary(db) });
        }

        if (request.method !== "POST") return new Response(null, { status: 405 });
        if (!isSameOriginRequest(request, env.APP_ORIGIN)) {
          return new Response(null, { status: 403 });
        }

        let vote = null;
        try {
          vote = await request.json();
        } catch (err) {
          return json({ error: "bad_json" }, 400);
        }

        const id = vote && vote.id;
        const stars = Number(vote && vote.stars);
        const voter = vote && vote.voter;
        if (typeof id !== "string" || !SERVICE_ID.test(id)) return json({ error: "bad_id" }, 400);
        if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
          return json({ error: "bad_stars" }, 400);
        }
        if (typeof voter !== "string" || !VOTER_ID.test(voter)) {
          return json({ error: "bad_voter" }, 400);
        }

        await db
          .prepare(
            "INSERT INTO ratings (service_id, voter, stars) VALUES (?, ?, ?) " +
              "ON CONFLICT(service_id, voter) DO UPDATE SET stars = excluded.stars, " +
              "created_at = datetime('now')"
          )
          .bind(id, voter, stars)
          .run();

        const one = (await ratingSummary(db, id))[id] || { avg: 0, count: 0 };
        return json({ id, avg: one.avg, count: one.count, yours: stars });
      }

      if (path === "/api/favorites" || path.startsWith("/api/favorites/")) {
        const user = await signed.getUser(request);
        if (!user) return json({ error: "signin_required" }, 401);

        const db = env.DB;
        if (!db) return json({ error: "unavailable" }, 503);
        await ensureSchema(db);

        if (path === "/api/favorites" && request.method === "GET") {
          return json({ ids: await listFavorites(db, user.sub) });
        }

        if (request.method !== "POST") return new Response(null, { status: 405 });
        if (!isSameOriginRequest(request, env.APP_ORIGIN)) {
          return new Response(null, { status: 403 });
        }

        let body = null;
        try {
          body = await request.json();
        } catch (err) {
          return json({ error: "bad_json" }, 400);
        }

        if (path === "/api/favorites/toggle") {
          const id = body && body.id;
          if (typeof id !== "string" || !SERVICE_ID.test(id)) {
            return json({ error: "bad_id" }, 400);
          }
          const existing = await db
            .prepare("SELECT 1 AS found FROM favorites WHERE user_id = ? AND service_id = ?")
            .bind(user.sub, id)
            .first();
          if (existing) {
            await db
              .prepare("DELETE FROM favorites WHERE user_id = ? AND service_id = ?")
              .bind(user.sub, id)
              .run();
          } else {
            await db
              .prepare("INSERT INTO favorites (user_id, service_id) VALUES (?, ?)")
              .bind(user.sub, id)
              .run();
          }
          return json({ ids: await listFavorites(db, user.sub) });
        }

        // First sign-in on a device: keep what was already saved in the browser.
        if (path === "/api/favorites/merge") {
          const incoming = Array.isArray(body && body.ids) ? body.ids : [];
          const ids = incoming
            .filter((id) => typeof id === "string" && SERVICE_ID.test(id))
            .slice(0, 300);
          for (const id of ids) {
            await db
              .prepare("INSERT OR IGNORE INTO favorites (user_id, service_id) VALUES (?, ?)")
              .bind(user.sub, id)
              .run();
          }
          return json({ ids: await listFavorites(db, user.sub) });
        }

        return new Response(null, { status: 404 });
      }

      return env.ASSETS.fetch(request);
    });
  }

  return app;
}

export default {
  fetch(request, env) {
    return setup(env)(request, env);
  },
};
