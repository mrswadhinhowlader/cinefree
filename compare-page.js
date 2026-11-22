/* Renders the comparison table for compare.html?ids=a,b,c */
(function () {
  var t = CF.t;
  var root = document.getElementById("compare-root");
  var params = new URLSearchParams(location.search);

  var picked = (params.get("ids") || "")
    .split(",")
    .map(function (s) {
      return s.trim();
    })
    .filter(Boolean)
    .filter(function (id, i, arr) {
      return arr.indexOf(id) === i;
    })
    .map(function (id) {
      return (typeof SERVICES !== "undefined" ? SERVICES : []).find(function (s) {
        return s.id === id;
      });
    })
    .filter(Boolean)
    .slice(0, 3);

  document.title = t("compare_page_title");

  if (!picked.length) {
    root.innerHTML =
      '<div class="not-found">' +
      '<p class="empty-icon" aria-hidden="true">⇄</p>' +
      "<h1>" +
      t("compare_empty_title") +
      "</h1><p>" +
      t("compare_empty_text") +
      "</p>" +
      '<a class="btn-review inline" href="index.html">' +
      t("notfound_cta") +
      "</a></div>";
    return;
  }

  function logoMarkup(base) {
    var file = typeof LOGOS !== "undefined" ? LOGOS[base.id] : null;
    var parts = base.color.split(",").map(function (c) {
      return c.trim();
    });
    return (
      '<span class="review-logo small' +
      (file ? " has-logo" : "") +
      '" style="--c1:' +
      parts[0] +
      ";--c2:" +
      parts[1] +
      '">' +
      '<span class="tile-letter" aria-hidden="true">' +
      base.initial +
      "</span>" +
      (file
        ? '<img class="tile-logo" src="assets/logos/' + file + '" alt="" loading="lazy" onerror="this.remove()" />'
        : "") +
      "</span>"
    );
  }

  function headCell(base) {
    var loc = CF.service(base);
    var url = (typeof SERVICE_URLS !== "undefined" && SERVICE_URLS[base.id]) || "#";
    return (
      '<th scope="col" class="cmp-col">' +
      '<div class="cmp-col-head">' +
      logoMarkup(base) +
      "<strong>" +
      loc.name +
      "</strong>" +
      '<span class="rating small"><span class="star" aria-hidden="true">★</span>' +
      base.rating.toFixed(1) +
      "</span>" +
      "</div>" +
      '<div class="cmp-links">' +
      '<a class="btn-review" href="review.html?id=' +
      base.id +
      '">' +
      t("btn_review") +
      "</a>" +
      '<a class="tool-btn" href="' +
      url +
      '" target="_blank" rel="noopener noreferrer">' +
      t("btn_visit") +
      ' <span aria-hidden="true">↗</span></a>' +
      '<button class="tool-btn" type="button" data-compare-remove="' +
      base.id +
      '">' +
      t("compare_remove") +
      "</button>" +
      "</div></th>"
    );
  }

  function starsMarkup(rating) {
    var full = Math.round(rating);
    var out = "";
    for (var i = 1; i <= 5; i++) out += '<span class="star' + (i <= full ? " on" : "") + '" aria-hidden="true">★</span>';
    return '<span class="stars" role="img" aria-label="' + t("stars_aria", { r: rating.toFixed(1) }) + '">' + out + "</span>";
  }

  function cellList(items) {
    return "<ul>" + items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>";
  }

  var rows = [
    [
      t("cmp_rating"),
      function (b) {
        return starsMarkup(b.rating) + ' <span class="muted">' + b.rating.toFixed(1) + t("of_five") + "</span>";
      },
    ],
    [
      t("cmp_ads"),
      function (b) {
        return CF.adsLabel(b.ads);
      },
    ],
    [
      t("cmp_cost"),
      function (b) {
        return b.ads === 0 ? t("cost_free") : t("cost_ads");
      },
    ],
    [
      t("cmp_region"),
      function (b) {
        return CF.service(b).availability;
      },
    ],
    [
      t("cmp_cats"),
      function (b) {
        return b.categories.map(function (c) { return CF.categoryLabel(c); }).join(", ");
      },
    ],
    [
      t("cmp_best"),
      function (b) {
        return CF.service(b).bestFor;
      },
    ],
    [
      t("cmp_pros"),
      function (b) {
        return cellList(CF.service(b).pros);
      },
    ],
    [
      t("cmp_cons"),
      function (b) {
        return cellList(CF.service(b).cons);
      },
    ],
    [
      t("cmp_verdict"),
      function (b) {
        return CF.service(b).review;
      },
    ],
  ];

  root.innerHTML =
    '<a class="back-link" href="index.html">' +
    t("back_all") +
    "</a>" +
    '<header class="compare-head"><h1>' +
    t("compare_page_title") +
    "</h1><p class=\"compare-sub\">" +
    t("compare_sub") +
    "</p></header>" +
    '<div class="cmp-scroll"><table class="cmp-table"><thead><tr><th scope="col" class="cmp-label"></th>' +
    picked.map(headCell).join("") +
    "</tr></thead><tbody>" +
    rows
      .map(function (row) {
        return (
          "<tr><th scope=\"row\">" +
          row[0] +
          "</th>" +
          picked.map(function (b) { return "<td>" + row[1](b) + "</td>"; }).join("") +
          "</tr>"
        );
      })
      .join("") +
    "</tbody></table></div>";

  root.addEventListener("click", function (event) {
    var btn = event.target.closest("[data-compare-remove]");
    if (!btn) return;
    event.preventDefault();
    event.stopPropagation();
    var id = btn.getAttribute("data-compare-remove");
    if (window.CFCompare) CFCompare.toggle(id);
    picked = picked.filter(function (b) { return b.id !== id; });
    location.href = picked.length ? "compare.html?ids=" + picked.map(function (b) { return b.id; }).join(",") : "index.html";
  });

  if (window.CFCompare) CFCompare.paint();
})();
