(function () {
  const t = CF.t;
  const num = CF.num;

  const grid = document.getElementById("grid");
  const chipsEl = document.getElementById("category-chips");
  const regionEl = document.getElementById("region-filter");
  const sortEl = document.getElementById("sort-select");
  const searchEl = document.getElementById("search");
  const clearEl = document.getElementById("clear-search");
  const countEl = document.getElementById("result-count");
  const emptyEl = document.getElementById("empty");
  const emptyTitleEl = document.getElementById("empty-title");
  const emptyTextEl = document.getElementById("empty-text");
  const emptyActionEl = document.getElementById("empty-action");
  const statCountEl = document.getElementById("stat-count");
  const favToggleEl = document.getElementById("fav-toggle");
  const favCountEl = document.getElementById("fav-count");
  const eyebrowEl = document.querySelector(".eyebrow");

  const CATEGORIES_LOC = CF.categories();
  const REGIONS_LOC = CF.regions();
  const CATEGORY_LABELS = Object.fromEntries(CATEGORIES_LOC.map((c) => [c.key, c.label]));

  const state = {
    category: "all",
    region: "all",
    sort: "rating",
    query: "",
    onlyFavorites: false,
    collection: null,
  };

  /* ---------- favourites (FavStore: local cache + account sync) ---------- */
  const FavStore = window.FavStore;

  function updateFavCount() {
    favCountEl.textContent = num(FavStore.size());
    favToggleEl.classList.toggle("has-favorites", FavStore.size() > 0);
  }

  function favLabels(name, active) {
    if (CF.lang === "bn") {
      return active ? `${name} — প্রিয় তালিকা থেকে সরাও` : `${name} — প্রিয় তালিকায় সেভ করো`;
    }
    return active ? `${name} — remove from favourites` : `${name} — save to favourites`;
  }

  function paintFavButton(btn, service) {
    const active = FavStore.has(service.id);
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", String(active));
    btn.setAttribute("aria-label", favLabels(service.name, active));
    btn.title = favLabels(service.name, active);
    btn.innerHTML = `<span aria-hidden="true">${active ? "♥" : "♡"}</span>`;
  }

  /* ---------- logo ---------- */
  function logoMarkup(service) {
    const file = typeof LOGOS !== "undefined" ? LOGOS[service.id] : null;
    const mark = `<span class="tile-letter" aria-hidden="true">${service.initial}</span>`;
    if (!file) return mark;
    return (
      mark +
      `<img class="tile-logo" src="assets/logos/${file}" alt="${service.name}" loading="lazy"` +
      ` onerror="this.remove()" />`
    );
  }

  /* ---------- filter UI ---------- */
  CATEGORIES_LOC.forEach((cat) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    btn.role = "tab";
    btn.dataset.key = cat.key;
    btn.textContent = cat.label;
    btn.setAttribute("aria-selected", cat.key === state.category ? "true" : "false");
    btn.addEventListener("click", () => {
      state.category = cat.key;
      [...chipsEl.children].forEach((c) =>
        c.setAttribute("aria-selected", c.dataset.key === cat.key ? "true" : "false")
      );
      render();
    });
    chipsEl.appendChild(btn);
  });

  REGIONS_LOC.forEach((r) => {
    const opt = document.createElement("option");
    opt.value = r.key;
    opt.textContent = r.label;
    regionEl.appendChild(opt);
  });

  // দেশভিত্তিক পেজের প্রিসেট (bangladesh.html, india.html …)
  if (window.REGION_PRESET && REGIONS_LOC.some((r) => r.key === window.REGION_PRESET)) {
    state.region = window.REGION_PRESET;
    regionEl.value = window.REGION_PRESET;
  }

  /* ---------- curated collections ---------- */
  const collectionsEl = document.getElementById("collections");
  if (collectionsEl && typeof COLLECTIONS !== "undefined") {
    COLLECTIONS.forEach((col) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "collection";
      btn.dataset.collection = col.key;
      btn.textContent = t("col_" + col.key);
      btn.setAttribute("aria-pressed", "false");
      btn.addEventListener("click", () => {
        state.collection = state.collection === col.key ? null : col.key;
        [...collectionsEl.children].forEach((c) => {
          const active = c.dataset.collection === state.collection;
          c.classList.toggle("active", active);
          c.setAttribute("aria-pressed", String(active));
        });
        render();
      });
      collectionsEl.appendChild(btn);
    });
  }

  /* ---------- country links ---------- */
  const placesEl = document.getElementById("places-row");
  if (placesEl) {
    [
      ["bangladesh.html", "bangladesh"],
      ["india.html", "india"],
      ["usa.html", "us"],
      ["uk.html", "uk"],
      ["canada.html", "canada"],
      ["australia.html", "australia"],
      ["europe.html", "europe"],
    ].forEach(([page, region]) => {
      const a = document.createElement("a");
      a.className = "place-link";
      a.href = page;
      a.textContent = CF.regionLabel(region);
      placesEl.appendChild(a);
    });
  }

  /* ---------- filter + sort ---------- */
  function matches(service) {
    if (state.collection) {
      const col = COLLECTIONS.find((c) => c.key === state.collection);
      if (col && col.ids.indexOf(service.id) === -1) return false;
    }
    if (state.onlyFavorites && !FavStore.has(service.id)) return false;
    if (state.category !== "all" && !service.categories.includes(state.category)) return false;
    if (state.region !== "all" && !service.regions.includes(state.region)) return false;
    if (!state.query) return true;

    const loc = CF.service(service);
    const haystack = [
      loc.name,
      loc.tagline,
      loc.review,
      loc.availability,
      loc.bestFor,
      service.name,
      ...service.categories.map((c) => CATEGORY_LABELS[c] || ""),
      ...loc.pros,
      ...loc.cons,
    ]
      .join(" ")
      .toLowerCase();

    return state.query
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .every((word) => haystack.includes(word));
  }

  function sorted(list) {
    const copy = list.slice();
    if (state.sort === "rating") copy.sort((a, b) => b.rating - a.rating);
    if (state.sort === "name") copy.sort((a, b) => a.name.localeCompare(b.name, CF.lang === "bn" ? "bn" : "en"));
    if (state.sort === "ads") copy.sort((a, b) => a.ads - b.ads || b.rating - a.rating);
    return copy;
  }

  /* ---------- cards ---------- */
  function card(service) {
    const loc = CF.service(service);
    const el = document.createElement("article");
    el.className = "card" + (service.rating >= 4.4 ? " pick" : "");

    const tags = service.categories
      .map((c) => `<span class="tag">${CATEGORY_LABELS[c] || c}</span>`)
      .join("");
    const adTag = `<span class="tag ${service.ads === 0 ? "ads-0" : ""}">${CF.adsLabel(service.ads)}</span>`;
    const url = (typeof SERVICE_URLS !== "undefined" && SERVICE_URLS[service.id]) || "#";

    el.innerHTML = `
      ${service.rating >= 4.4 ? `<span class="badge">${t("editors")}</span>` : ""}
      <div class="card-head">
        <div class="tile${typeof LOGOS !== "undefined" && LOGOS[service.id] ? " has-logo" : ""}" style="--c1:${
      service.color.split(",")[0].trim()
    };--c2:${service.color.split(",")[1].trim()}">${logoMarkup(service)}</div>
        <div class="card-titles">
          <h3>${loc.name}</h3>
          <span class="avail">${loc.availability}</span>
        </div>
        <div class="card-side">
          <span class="rating"><span class="star" aria-hidden="true">★</span>${service.rating.toFixed(1)}</span>
          <button class="fav-btn" type="button" data-fav="${service.id}"></button>
        </div>
      </div>

      <p class="tagline">${loc.tagline}</p>
      <div class="tags">${tags}${adTag}</div>
      <p class="card-rate" data-rate-summary="${service.id}" hidden></p>

      <div class="card-actions">
        <a class="btn-review" href="review.html?id=${service.id}">${t("btn_review")}</a>
        <a class="btn-visit" href="${url}" target="_blank" rel="noopener noreferrer">${t(
      "btn_visit"
    )} <span aria-hidden="true">↗</span></a>
      </div>

      <div class="card-tools">
        <button class="tool-btn" type="button" data-compare="${service.id}" aria-pressed="false">
          <span aria-hidden="true">⇄</span><span>${t("compare")}</span>
        </button>
        <button class="tool-btn" type="button" data-share="${service.id}" aria-label="${t("share_aria", {
          name: loc.name,
        })}">
          <span aria-hidden="true">⤴</span><span>${t("share")}</span>
        </button>
      </div>
    `;

    paintFavButton(el.querySelector(".fav-btn"), service);
    return el;
  }

  function render() {
    const list = sorted(SERVICES.filter(matches));
    grid.innerHTML = "";
    const frag = document.createDocumentFragment();
    list.forEach((s) => frag.appendChild(card(s)));
    grid.appendChild(frag);
    if (window.CFRatings) CFRatings.sync();
    if (window.CFCompare) CFCompare.paint();

    statCountEl.textContent = num(SERVICES.length);
    const catCount = CATEGORIES.filter((c) => c.key !== "all").length;
    const catsEl = document.getElementById("stat-cats");
    const legitEl = document.getElementById("stat-legit");
    if (catsEl) catsEl.textContent = num(catCount);
    if (legitEl) legitEl.textContent = num(100) + "%";
    if (eyebrowEl) eyebrowEl.textContent = t("hero_eyebrow", { n: num(SERVICES.length) });
    countEl.textContent = list.length ? t("results_shown", { n: num(list.length) }) : t("results_none");

    const nothingSaved = state.onlyFavorites && FavStore.size() === 0;
    emptyTitleEl.textContent = nothingSaved ? t("empty_fav_title") : t("empty_title");
    emptyTextEl.textContent = nothingSaved ? t("empty_fav_text") : t("empty_text");

    emptyEl.hidden = list.length > 0;
    grid.hidden = list.length === 0;
    clearEl.hidden = state.query.length === 0;
    favToggleEl.setAttribute("aria-pressed", String(state.onlyFavorites));

    updateFavCount();
  }

  /* ---------- events ---------- */
  let debounce;
  searchEl.addEventListener("input", (e) => {
    const value = e.target.value;
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      state.query = value.trim();
      render();
    }, 120);
  });

  clearEl.addEventListener("click", () => {
    searchEl.value = "";
    state.query = "";
    searchEl.focus();
    render();
  });

  regionEl.addEventListener("change", (e) => {
    state.region = e.target.value;
    render();
  });

  sortEl.addEventListener("change", (e) => {
    state.sort = e.target.value;
    render();
  });

  favToggleEl.addEventListener("click", () => {
    state.onlyFavorites = !state.onlyFavorites;
    favToggleEl.classList.toggle("active", state.onlyFavorites);
    render();
  });

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-fav]");
    if (!btn) return;
    FavStore.toggle(btn.dataset.fav);
  });

  // any change, including one that arrived from the account: repaint
  FavStore.onChange(() => {
    updateFavCount();
    grid.querySelectorAll("[data-fav]").forEach((btn) => {
      const service = SERVICES.find((s) => s.id === btn.dataset.fav);
      if (service) paintFavButton(btn, service);
    });
    if (state.onlyFavorites) render();
  });

  emptyActionEl.addEventListener("click", () => {
    state.category = "all";
    state.region = "all";
    state.sort = "rating";
    state.query = "";
    state.onlyFavorites = false;
    state.collection = null;
    if (collectionsEl) {
      [...collectionsEl.children].forEach((c) => {
        c.classList.remove("active");
        c.setAttribute("aria-pressed", "false");
      });
    }
    searchEl.value = "";
    regionEl.value = "all";
    sortEl.value = "rating";
    favToggleEl.classList.remove("active");
    [...chipsEl.children].forEach((c) =>
      c.setAttribute("aria-selected", c.dataset.key === "all" ? "true" : "false")
    );
    render();
  });

  render();

  FavStore.refreshAccount();
})();
