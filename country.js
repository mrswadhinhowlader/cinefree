/* Country picker in the header: one tap to the page for your country. */
(function () {
  var t = CF.t;
  var COUNTRIES = [
    { page: "index.html", key: "all", flag: "🌍" },
    { page: "bangladesh.html", key: "bangladesh", flag: "🇧🇩" },
    { page: "india.html", key: "india", flag: "🇮🇳" },
    { page: "usa.html", key: "us", flag: "🇺🇸" },
    { page: "uk.html", key: "uk", flag: "🇬🇧" },
    { page: "canada.html", key: "canada", flag: "🇨🇦" },
    { page: "australia.html", key: "australia", flag: "🇦🇺" },
    { page: "europe.html", key: "europe", flag: "🇪🇺" },
  ];

  function build() {
    var host = document.querySelector(".header-right");
    if (!host || host.querySelector(".country-picker")) return;

    var current = (location.pathname.split("/").pop() || "index.html").toLowerCase();

    var wrap = document.createElement("div");
    wrap.className = "country-picker";

    var btn = document.createElement("button");
    btn.className = "country-toggle";
    btn.type = "button";
    btn.id = "country-btn";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-haspopup", "true");
    btn.title = t("country_menu_aria");
    btn.setAttribute("aria-label", t("country_menu_aria"));
    btn.innerHTML = '<span class="globe" aria-hidden="true">🌍</span><span class="country-label"></span>';
    btn.querySelector(".country-label").textContent = t("country_btn");

    var menu = document.createElement("div");
    menu.className = "country-menu";
    menu.id = "country-menu";
    menu.hidden = true;
    menu.innerHTML = COUNTRIES.map(function (c) {
      var label = c.key === "all" ? t("country_all") : CF.regionLabel(c.key);
      var here = c.page === current ? ' aria-current="page"' : "";
      return '<a href="' + c.page + '"' + here + '><span aria-hidden="true">' + c.flag + "</span>" + label + "</a>";
    }).join("");

    wrap.appendChild(btn);
    wrap.appendChild(menu);
    host.insertBefore(wrap, host.firstChild);

    function close() {
      menu.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    }

    btn.addEventListener("click", function (event) {
      event.stopPropagation();
      var open = menu.hidden;
      menu.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
    });

    document.addEventListener("click", function (event) {
      if (!wrap.contains(event.target)) close();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        close();
        btn.focus();
      }
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) close();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
