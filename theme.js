/* থিম (ডার্ক/লাইট) — দুই পেজেই ব্যবহৃত */
(function () {
  var KEY = "cinefree:theme";
  var root = document.documentElement;

  function saved() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function prefer() {
    try {
      return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    } catch (e) {
      return "dark";
    }
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(KEY, theme);
    } catch (e) {}
    paint();
  }

  function ar(en, bn) {
    return window.CF && CF.lang === "en" ? en : bn;
  }

  function paint() {
    var current = root.getAttribute("data-theme") || "dark";
    var lightName = window.CF ? CF.t("theme_light") : ar("Light", "লাইট");
    var darkName = window.CF ? CF.t("theme_dark") : ar("Dark", "ডার্ক");
    var goingTo = current === "dark" ? lightName : darkName;
    var switchText = window.CF ? CF.t("theme_switch", { mode: goingTo }) : goingTo + " মোডে যাও";
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(current === "light"));
      btn.setAttribute("aria-label", switchText);
      btn.title = switchText;
      var icon = btn.querySelector(".theme-icon");
      var label = btn.querySelector(".theme-label");
      if (icon) icon.textContent = current === "dark" ? "☾" : "☀";
      if (label) label.textContent = current === "dark" ? darkName : lightName;
    });
  }

  // প্রথম রেন্ডারের আগেই থিম বসাও (ফ্ল্যাশ এড়াতে)
  root.setAttribute("data-theme", saved() || prefer());

  document.addEventListener("DOMContentLoaded", function () {
    paint();
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var next = (root.getAttribute("data-theme") || "dark") === "dark" ? "light" : "dark";
        apply(next);
      });
    });
  });
})();
