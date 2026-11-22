/* Shared favourites store: always local, synced to the account when signed in. */
(function () {
  const FAV_KEY = "cinefree:favorites:v1";
  const listeners = [];
  const store = { ids: new Set(), user: null, loading: true };
  const t = CF.t;

  try {
    const stored = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
    if (Array.isArray(stored)) stored.forEach((id) => store.ids.add(String(id)));
  } catch (err) {
    /* storage unavailable — memory only */
  }

  function saveLocal() {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify([...store.ids]));
    } catch (err) {}
  }

  function emit() {
    listeners.forEach((fn) => {
      try {
        fn(store);
      } catch (err) {}
    });
  }

  function call(path, body) {
    return fetch(
      path,
      body
        ? {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(body),
            cache: "no-store",
            credentials: "same-origin",
          }
        : { cache: "no-store", credentials: "same-origin" }
    );
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));
  }

  /* ---------- header account box ---------- */
  function renderAccount() {
    const host = document.querySelector(".header-right");
    if (!host) return;
    let box = document.getElementById("account-box");
    if (!box) {
      box = document.createElement("div");
      box.id = "account-box";
      box.className = "account";
      host.appendChild(box);
    }

    if (store.loading) {
      box.innerHTML = "";
      box.hidden = true;
      return;
    }
    box.hidden = false;

    if (store.user) {
      const name = store.user.name || store.user.email || t("account_fallback");
      box.innerHTML =
        `<span class="account-name" title="${escapeHtml(t("account_synced"))}">` +
        `<span class="account-dot" aria-hidden="true"></span>${escapeHtml(name)}</span>` +
        `<form method="POST" action="/auth/freebuff/signout" class="account-out">` +
        `<button type="submit">${t("sign_out")}</button></form>`;
    } else {
      const returnTo = location.pathname + location.search;
      box.innerHTML =
        `<a class="account-in" href="/auth/freebuff/signin?returnTo=${encodeURIComponent(returnTo)}">` +
        `${t("sign_in")}</a>`;
    }
  }

  async function pushToggle(id) {
    if (!store.user) return;
    try {
      const res = await call("/api/favorites/toggle", { id });
      if (!res.ok) return;
      const data = await res.json();
      store.ids = new Set(data.ids);
      saveLocal();
      emit();
    } catch (err) {}
  }

  async function boot() {
    let user = null;
    try {
      const res = await call("/api/me");
      if (res.ok) {
        const data = await res.json();
        user = data.user || null;
      }
    } catch (err) {}

    store.user = user;

    if (user) {
      try {
        const res = await call("/api/favorites/merge", { ids: [...store.ids] });
        if (res.ok) {
          const data = await res.json();
          store.ids = new Set(data.ids);
          saveLocal();
        }
      } catch (err) {}
    }

    store.loading = false;
    renderAccount();
    emit();
  }

  window.FavStore = {
    has(id) {
      return store.ids.has(id);
    },
    size() {
      return store.ids.size;
    },
    get user() {
      return store.user;
    },
    toggle(id) {
      const active = store.ids.has(id);
      if (active) store.ids.delete(id);
      else store.ids.add(id);
      saveLocal();
      emit();
      pushToggle(id);
      return !active;
    },
    refreshAccount: renderAccount,
    onChange(fn) {
      listeners.push(fn);
    },
  };

  boot();
})();
