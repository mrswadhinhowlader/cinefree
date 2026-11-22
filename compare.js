/* Compare up to three services side by side.
   The list lives in this browser (localStorage) and drives the floating bar. */
(function () {
  var t = CF.t;
  var num = CF.num;
  var KEY = "cinefree:compare:v1";
  var MAX = 3;
  var listeners = [];
  var ids = load();
  var bar = null;

  function known(id) {
    return (typeof SERVICES !== "undefined" ? SERVICES : []).some(function (s) {
      return s.id === id;
    });
  }

  function load() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (!Array.isArray(raw)) return [];
      return raw
        .map(String)
        .filter(known)
        .filter(function (id, i, arr) {
          return arr.indexOf(id) === i;
        })
        .slice(0, MAX);
    } catch (err) {
      return [];
    }
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch (err) {}
  }

  function emit() {
    listeners.forEach(function (fn) {
      try {
        fn(ids.slice());
      } catch (err) {}
    });
  }

  function nameOf(id) {
    var base = (typeof SERVICES !== "undefined" ? SERVICES : []).find(function (s) {
      return s.id === id;
    });
    return base ? CF.service(base).name : id;
  }

  function toggle(id) {
    if (!known(id)) return;
    var at = ids.indexOf(id);
    if (at !== -1) ids.splice(at, 1);
    else if (ids.length >= MAX) {
      if (window.CFNotify) CFNotify(t("compare_full"));
      return;
    } else ids.push(id);
    save();
    render();
    paint();
    emit();
  }

  function clear() {
    ids = [];
    save();
    render();
    paint();
    emit();
  }

  function compareHref() {
    return "compare.html?ids=" + ids.map(encodeURIComponent).join(",");
  }

  /* ---------- card / page buttons ---------- */
  function paint() {
    document.querySelectorAll("[data-compare]").forEach(function (btn) {
      var id = btn.getAttribute("data-compare");
      var on = ids.indexOf(id) !== -1;
      btn.setAttribute("aria-pressed", String(on));
      var label = nameOf(id) + " — " + t(on ? "compare_added" : "compare_add");
      btn.setAttribute("aria-label", label);
      btn.title = label;
    });
  }

  /* ---------- floating bar ---------- */
  function buildBar() {
    bar = document.createElement("div");
    bar.className = "compare-bar";
    bar.id = "compare-bar";
    bar.hidden = true;
    bar.innerHTML =
      '<div class="wrap compare-bar-inner">' +
      '<p class="compare-bar-text" id="compare-bar-text"></p>' +
      '<div class="compare-bar-items" id="compare-bar-items"></div>' +
      '<a class="btn-review" id="compare-go" href="compare.html"></a>' +
      '<button class="tool-btn compare-bar-clear" type="button" id="compare-clear"></button>' +
      "</div>";
    document.body.appendChild(bar);

    bar.querySelector("#compare-clear").addEventListener("click", clear);
    bar.addEventListener("click", function (event) {
      var chipBtn = event.target.closest("[data-compare-remove]");
      if (chipBtn) toggle(chipBtn.getAttribute("data-compare-remove"));
    });
  }

  function render() {
    if (!bar) return;
    var empty = ids.length === 0;
    bar.hidden = empty;
    document.body.classList.toggle("has-compare-bar", !empty);
    if (empty) return;

    bar.querySelector("#compare-bar-text").textContent = t("compare_bar_n", { n: num(ids.length) });
    bar.querySelector("#compare-bar-items").innerHTML = ids
      .map(function (id) {
        return (
          '<span class="compare-chip">' +
          nameOf(id) +
          '<button type="button" data-compare-remove="' +
          id +
          '" aria-label="' +
          t("compare_remove") +
          '">×</button></span>'
        );
      })
      .join("");
    var go = bar.querySelector("#compare-go");
    go.href = compareHref();
    go.textContent = t("compare_go");
    bar.querySelector("#compare-clear").textContent = t("compare_clear");
  }

  function boot() {
    buildBar();
    render();
    paint();
    document.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-compare]:not([data-compare-remove])");
      if (!btn) return;
      event.preventDefault();
      toggle(btn.getAttribute("data-compare"));
    });
  }

  window.CFCompare = {
    ids: function () {
      return ids.slice();
    },
    has: function (id) {
      return ids.indexOf(id) !== -1;
    },
    toggle: toggle,
    clear: clear,
    paint: paint,
    onChange: function (fn) {
      listeners.push(fn);
    },
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
