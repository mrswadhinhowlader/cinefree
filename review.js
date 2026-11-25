(function () {
  const t = CF.t;
  const root = document.getElementById("review-root");

  const id = new URLSearchParams(location.search).get("id");
  const base = SERVICES.find((s) => s.id === id);

  /* ---------- favourites (FavStore: local cache + account sync) ---------- */
  const FavStore = window.FavStore;

  function starsMarkup(rating) {
    const full = Math.round(rating);
    let out = "";
    for (let i = 1; i <= 5; i++) out += `<span class="star${i <= full ? " on" : ""}" aria-hidden="true">★</span>`;
    return `<span class="stars" role="img" aria-label="${t("stars_aria", { r: rating.toFixed(1) })}">${out}</span>`;
  }

  if (!base) {
    document.title = "CineFree";
    root.innerHTML = `
      <div class="not-found">
        <p class="empty-icon" aria-hidden="true">🎬</p>
        <h1>${t("notfound_title")}</h1>
        <p>${t("notfound_text")}</p>
        <a class="btn-review inline" href="index.html">${t("notfound_cta")}</a>
      </div>`;
    return;
  }

  const service = CF.service(base);
  document.title = `${service.name} — ${t("review_meta")} | CineFree`;

  /* ---------- per-review SEO: canonical, og:url, title and description ---------- */
  (function () {
    const canonical = location.origin + "/review?id=" + encodeURIComponent(base.id);
    const desc = `${service.name}: ${service.tagline} ${service.availability}.`;

    function setMeta(selector, create) {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = create();
        document.head.appendChild(el);
      }
      return el;
    }

    const link = setMeta('link[rel="canonical"]', () => {
      const l = document.createElement("link");
      l.rel = "canonical";
      return l;
    });
    link.href = canonical;

    setMeta('meta[name="description"]', () => {
      const m = document.createElement("meta");
      m.name = "description";
      return m;
    }).content = desc;

    [
      ['meta[property="og:url"]', "property", "og:url", canonical],
      ['meta[property="og:title"]', "property", "og:title", document.title],
      ['meta[property="og:description"]', "property", "og:description", desc],
      ['meta[name="twitter:title"]', "name", "twitter:title", document.title],
      ['meta[name="twitter:description"]', "name", "twitter:description", desc],
    ].forEach(([selector, attr, key, value]) => {
      setMeta(selector, () => {
        const m = document.createElement("meta");
        m.setAttribute(attr, key);
        return m;
      }).setAttribute("content", value);
    });
  })();

  const url = SERVICE_URLS[base.id] || "#";
  const logoFile = typeof LOGOS !== "undefined" ? LOGOS[base.id] : null;
  const parts = base.color.split(",").map((c) => c.trim());

  const tags = base.categories
    .map((c) => `<span class="tag">${CF.categoryLabel(c)}</span>`)
    .join("");
  const adTag = `<span class="tag ${base.ads === 0 ? "ads-0" : ""}">${CF.adsLabel(base.ads)}</span>`;

  const logoMarkup = `
    <span class="tile-letter" aria-hidden="true">${base.initial}</span>
    ${logoFile ? `<img class="tile-logo" src="assets/logos/${logoFile}" alt="${service.name}" onerror="this.remove()" />` : ""}`;

  const regions = base.regions.map((r) => CF.regionLabel(r)).join(" · ");
  const cats = base.categories.map((c) => CF.categoryLabel(c)).join(", ");

  const related = SERVICES.filter(
    (s) => s.id !== base.id && s.categories.some((c) => base.categories.includes(c))
  )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  root.innerHTML = `
    <a class="back-link" href="index.html">${t("back_all")}</a>

    <header class="review-hero">
      <div class="review-logo${logoFile ? " has-logo" : ""}" style="--c1:${parts[0]};--c2:${parts[1]}">${logoMarkup}</div>
      <div class="review-head-main">
        <div class="review-title-row">
          <h1>${service.name}</h1>
          <span class="rating big"><span class="star" aria-hidden="true">★</span>${service.rating.toFixed(1)}</span>
        </div>
        <p class="review-avail">${service.availability}</p>
        <div class="tags">${tags}${adTag}</div>
        <div class="review-cta">
          <a class="btn-review" href="${url}" target="_blank" rel="noopener noreferrer">${t(
    "btn_visit"
  )} <span aria-hidden="true">↗</span></a>
          <button class="fav-btn broad" type="button" data-fav="${base.id}"></button>
        </div>
        <div class="card-tools">
          <button class="tool-btn" type="button" data-share="${base.id}">
            <span aria-hidden="true">⤴</span><span>${t("share")}</span>
          </button>
          <button class="tool-btn" type="button" data-compare="${base.id}" aria-pressed="false">
            <span aria-hidden="true">⇄</span><span>${t("compare")}</span>
          </button>
        </div>
      </div>
    </header>

    <div class="review-layout">
      <article class="review-main">
        <section>
          <h2>${t("review_h2")}</h2>
          <p class="review-text">${service.review}</p>
        </section>

        <section class="pc-grid">
          <div class="pc pros box">
            <h4>${t("pros_h")}</h4>
            <ul>${service.pros.map((p) => `<li>${p}</li>`).join("")}</ul>
          </div>
          <div class="pc cons box">
            <h4>${t("cons_h")}</h4>
            <ul>${service.cons.map((c) => `<li>${c}</li>`).join("")}</ul>
          </div>
        </section>

        <p class="best"><strong>${t("best_prefix")}</strong> ${service.bestFor}</p>

        <section class="quick-facts">
          <h2>${t("facts_h2")}</h2>
          <dl>
            <div><dt>${t("fact_rating")}</dt><dd>${starsMarkup(base.rating)} <span class="muted">${base.rating.toFixed(
    1
  )}${t("of_five")}</span></dd></div>
            <div><dt>${t("fact_where")}</dt><dd>${service.availability}</dd></div>
            <div><dt>${t("fact_region")}</dt><dd>${regions}</dd></div>
            <div><dt>${t("fact_ads")}</dt><dd>${CF.adsLabel(base.ads)}</dd></div>
            <div><dt>${t("fact_cats")}</dt><dd>${cats}</dd></div>
            <div><dt>${t("fact_cost")}</dt><dd>${base.ads === 0 ? t("cost_free") : t("cost_ads")}</dd></div>
          </dl>
        </section>
      </article>

      <aside class="review-aside">
        <div class="aside-card">
          <p class="aside-rating">${base.rating.toFixed(1)}<span>${t("of_five")}</span></p>
          ${starsMarkup(base.rating)}
          <p class="muted small">${base.rating >= 4.4 ? t("aside_editor") : t("aside_ours")}</p>
          <a class="btn-review block" href="${url}" target="_blank" rel="noopener noreferrer">${t(
    "btn_visit"
  )} <span aria-hidden="true">↗</span></a>
          <p class="aside-note">${service.bestFor}</p>
        </div>
        <div class="aside-card rate-card" data-rate-widget="${base.id}"></div>
      </aside>
    </div>

    <section class="related">
      <h2>${t("related_h2")}</h2>
      <div class="related-grid">
        ${related
          .map((s) => {
            const loc = CF.service(s);
            const f = typeof LOGOS !== "undefined" ? LOGOS[s.id] : null;
            const p = s.color.split(",").map((c) => c.trim());
            return `<a class="related-card" href="review.html?id=${s.id}">
              <span class="review-logo small${f ? " has-logo" : ""}" style="--c1:${p[0]};--c2:${p[1]}">
                <span class="tile-letter" aria-hidden="true">${s.initial}</span>
                ${f ? `<img class="tile-logo" src="assets/logos/${f}" alt="" loading="lazy" onerror="this.remove()" />` : ""}
              </span>
              <span class="related-body">
                <strong>${loc.name}</strong>
                <small>${loc.tagline}</small>
              </span>
              <span class="rating small">★ ${s.rating.toFixed(1)}</span>
            </a>`;
          })
          .join("")}
      </div>
    </section>
  `;

  /* ---------- favourite button ---------- */
  const favBtn = root.querySelector("[data-fav]");

  function paint() {
    const active = FavStore.has(base.id);
    favBtn.classList.toggle("active", active);
    favBtn.setAttribute("aria-pressed", String(active));
    favBtn.innerHTML = `<span aria-hidden="true">${active ? "♥" : "♡"}</span> ${
      active ? t("saved_cta") : t("save_cta")
    }`;
  }

  favBtn.addEventListener("click", () => {
    FavStore.toggle(base.id);
  });

  FavStore.onChange(paint);

  paint();
  if (window.CFCompare) CFCompare.paint();
  if (window.CFRatings) CFRatings.sync();
  FavStore.refreshAccount();
})();
