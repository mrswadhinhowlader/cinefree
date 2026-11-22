/* Visit counter (D1-backed) + optional Google Analytics 4 tag.
   Google Analytics stays off until a Measurement ID is filled in below. */
(function () {
  var GA_ID = ""; // e.g. "G-XXXXXXXXXX" — paste a GA4 Measurement ID to switch it on

  var el = document.getElementById("visitStats");
  var CF = window.CF || null;

  function localise(n) {
    if (CF && CF.num) return CF.num(n);
    return String(n);
  }

  function paint(data) {
    if (!el || !data) return;
    var total = typeof data.total === "number" ? data.total : null;
    if (total === null) return;

    var totalText = CF
      ? CF.t("visits_total", { n: localise(total) })
      : total + " visitors so far";
    var todayText =
      typeof data.today === "number"
        ? " · " + (CF ? CF.t("visits_today", { n: localise(data.today) }) : data.today + " today")
        : "";

    el.textContent = totalText + todayText;
    el.hidden = false;
  }

  function countVisit() {
    var already = false;
    try {
      already = !!sessionStorage.getItem("cinefree:visited");
      sessionStorage.setItem("cinefree:visited", "1");
    } catch (e) {}

    fetch(already ? "/api/visits" : "/api/visit", {
      method: already ? "GET" : "POST",
      cache: "no-store",
      credentials: "same-origin",
      headers: already ? {} : { "content-type": "application/json" },
      body: already ? undefined : "{}",
    })
      .then(function (res) {
        return res.ok ? res.json() : null;
      })
      .then(function (data) {
        if (data) paint(data);
      })
      .catch(function () {});
  }

  function googleAnalytics() {
    if (!GA_ID) return;
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    var tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(tag);
    gtag("js", new Date());
    gtag("config", GA_ID, { anonymize_ip: true });
  }

  document.addEventListener("DOMContentLoaded", function () {
    countVisit();
    googleAnalytics();
  });
})();
