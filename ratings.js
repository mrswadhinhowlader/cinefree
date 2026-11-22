/* Visitor ratings (D1-backed).
   - anonymous: a random id in localStorage, no cookies, no personal data
   - one vote per browser per service, and it can be changed later
   - averages are public and cached in memory for the page's lifetime */
(function () {
  var CF = window.CF || null;
  var KEY_VOTER = "cinefree:voter";
  var KEY_MINE = "cinefree:myratings";

  var summary = {}; // id -> { avg, count }
  var mine = readMine();
  var ready = false;
  var loading = false;

  function readMine() {
    try {
      return JSON.parse(localStorage.getItem(KEY_MINE)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveMine() {
    try {
      localStorage.setItem(KEY_MINE, JSON.stringify(mine));
    } catch (e) {}
  }

  function voterId() {
    var id = "";
    try {
      id = localStorage.getItem(KEY_VOTER) || "";
    } catch (e) {}
    if (/^[a-z0-9]{8,40}$/.test(id)) return id;
    id = (Math.random().toString(36).slice(2) + Date.now().toString(36)).slice(0, 24);
    try {
      localStorage.setItem(KEY_VOTER, id);
    } catch (e) {}
    return id;
  }

  function tr(key, vars) {
    return CF && CF.t ? CF.t(key, vars || {}) : key;
  }

  function nf(n) {
    return CF && CF.num ? CF.num(n) : String(n);
  }

  function starRow(rating) {
    var full = Math.round(rating);
    var out = "";
    for (var i = 1; i <= 5; i++) {
      out += '<span class="star' + (i <= full ? " on" : "") + '" aria-hidden="true">★</span>';
    }
    return '<span class="stars">' + out + "</span>";
  }

  function votesText(count) {
    return tr(count === 1 ? "rate_votes_one" : "rate_votes", { n: nf(count) });
  }

  function avgText(data) {
    return (
      starRow(data.avg) +
      '<span class="rate-text">' +
      data.avg.toFixed(1) +
      " · " +
      votesText(data.count) +
      "</span>"
    );
  }

  function paintSummary(el) {
    var id = el.getAttribute("data-rate-summary");
    var data = summary[id];
    if (!data || !data.count) {
      el.innerHTML = "";
      el.hidden = true;
      return;
    }
    el.hidden = false;
    el.innerHTML = avgText(data);
  }

  function paintPick(id) {
    var my = mine[id] || 0;
    var out = "";
    for (var i = 1; i <= 5; i++) {
      out +=
        '<button type="button" data-stars="' +
        i +
        '" class="' +
        (i <= my ? "on" : "") +
        '" aria-label="' +
        tr("rate_aria", { s: nf(i) }) +
        '" aria-pressed="' +
        (i <= my ? "true" : "false") +
        '">★</button>';
    }
    return out;
  }

  function paintWidget(el) {
    var id = el.getAttribute("data-rate-widget");
    var data = summary[id];
    var my = mine[id] || 0;
    var hasVotes = data && data.count > 0;

    el.innerHTML =
      '<p class="rate-title">' +
      tr("rate_title") +
      "</p>" +
      '<p class="rate-avg">' +
      (hasVotes ? avgText(data) : '<span class="muted small">' + tr("rate_none") + "</span>") +
      "</p>" +
      '<div class="rate-pick" role="group" aria-label="' +
      tr("rate_your") +
      '">' +
      paintPick(id) +
      "</div>" +
      '<p class="rate-note small' +
      (my ? " is-thanks" : "") +
      '">' +
      (my ? tr("rate_thanks") : tr("rate_hint")) +
      "</p>";
  }

  function paint() {
    var sums = document.querySelectorAll("[data-rate-summary]");
    for (var i = 0; i < sums.length; i++) paintSummary(sums[i]);
    var widgets = document.querySelectorAll("[data-rate-widget]");
    for (var j = 0; j < widgets.length; j++) paintWidget(widgets[j]);
  }

  function load() {
    if (loading || ready) return;
    loading = true;
    fetch("/api/ratings", { cache: "no-store", credentials: "same-origin" })
      .then(function (res) {
        return res.ok ? res.json() : null;
      })
      .then(function (data) {
        if (data && data.ratings) summary = data.ratings;
        ready = true;
        loading = false;
        paint();
      })
      .catch(function () {
        loading = false;
      });
  }

  function send(id, value) {
    if (!id || !(value >= 1 && value <= 5)) return;
    mine[id] = value;
    saveMine();
    paint();

    fetch("/api/ratings", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: id, stars: value, voter: voterId() }),
    })
      .then(function (res) {
        return res.ok ? res.json() : null;
      })
      .then(function (data) {
        if (!data || typeof data.avg !== "number") return;
        summary[data.id] = { avg: data.avg, count: data.count };
        paint();
      })
      .catch(function () {});
  }

  // Called after every grid render so freshly drawn cards get their averages.
  function sync() {
    if (!ready) load();
    paint();
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest("[data-stars]") : null;
    if (!btn) return;
    var host = btn.closest("[data-rate-widget]");
    if (!host) return;
    send(host.getAttribute("data-rate-widget"), parseInt(btn.getAttribute("data-stars"), 10));
  });

  window.CFRatings = { sync: sync, paint: paint, reload: load };
})();
