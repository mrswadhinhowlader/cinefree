/* ============================================================
   ভাষা ব্যবস্থা / Language layer
   - প্রথমবার খোলার সময় দেশ/অঞ্চল দেখে ভাষা বাছা হয়
     (টাইমজোন + ব্রাউজারের ভাষা — কোনো ট্র্যাকিং বা API লাগে না)
   - বাংলাদেশ ও ভারত → বাংলা, বাকি বিশ্ব → English
   - হেডারের 🌐 বাটন দিয়ে হাতেও বদলানো যায়, পছন্দ ব্রাউজারে থাকে
   ============================================================ */
(function () {
  var STORAGE_KEY = "cinefree:lang";
  var SUPPORTED = ["bn", "en"];
  // বাংলাভাষী অঞ্চলের টাইমজোন = দেশ শনাক্তকরণ (কোনো নেটওয়ার্ক কল ছাড়াই)
  var BENGALI_ZONES = ["Asia/Dhaka", "Asia/Kolkata", "Asia/Calcutta"];

  function savedLang() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function detectLang() {
    var saved = savedLang();
    if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;

    var tz = "";
    try {
      tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    } catch (e) {}
    if (BENGALI_ZONES.indexOf(tz) !== -1) return "bn";

    var langs = navigator.languages || [navigator.language || "en"];
    for (var i = 0; i < langs.length; i++) {
      if (String(langs[i]).toLowerCase().indexOf("bn") === 0) return "bn";
    }
    return "en";
  }

  var LANG = detectLang();

  /* ---------- UI টেক্সট ---------- */
  var STRINGS = {
    bn: {
      brand_sub: "ফ্রি স্ট্রিমিং ডাইরেক্টরি",
      nav_dir: "ডাইরেক্টরি",
      nav_how: "কীভাবে বাছা হয়েছে",
      nav_back: "← ডাইরেক্টরি",
      hero_eyebrow: "{n}টি সার্ভিস · ২০২৬",
      hero_title: 'ফ্রি-তে মুভি আর সিরিজ দেখার<br /><span>সেরা জায়গাগুলো</span> এক জায়গায়',
      hero_sub:
        "শুধু বৈধ ও ফ্রি (বিজ্ঞাপন-সহ) সার্ভিস — কোনো পাইরেসি সাইট নেই, বাজে পপ-আপ নেই। ক্যাটাগরি বেছে নাও, সার্চ করো, আর প্রতিটি সাইটের আলাদা রিভিউ পড়ে ঠিক করো কোথায় কী দেখবে।",
      search_ph: "সাইট, কনটেন্ট বা ভাষা লিখে খোঁজো… (যেমন: অ্যানিমে, বাংলা, হলিউড)",
      search_aria: "সাইট খোঁজো",
      clear_aria: "সার্চ মুছো",
      stat_services: "সার্ভিস",
      stat_cats: "ক্যাটাগরি",
      stat_legit: "বৈধ ও ফ্রি",
      fav_only: "শুধু প্রিয়",
      label_region: "অঞ্চল",
      label_sort: "সাজাও",
      sort_rating: "রেটিং (বেশি আগে)",
      sort_name: "নাম (অ–ঔ)",
      sort_ads: "বিজ্ঞাপন (কম আগে)",
      results_shown: "{n}টি সাইট দেখানো হচ্ছে",
      results_none: "কোনো সাইট মেলেনি",
      empty_title: "কিছু পাওয়া যায়নি",
      empty_text: "অন্য কোনো শব্দে খোঁজো, অথবা ফিল্টার রিসেট করো।",
      empty_fav_title: "এখনো কিছু সেভ করা হয়নি",
      empty_fav_text: "যে সাইটগুলো ভালো লাগে তার হৃদয় আইকনে ট্যাপ করো — এখানে জমা হবে।",
      empty_fav_after: "আরও সাইট সেভ করলে সেগুলো এখানে দেখা যাবে।",
      empty_list: "তালিকা এখন খালি",
      reset_filters: "সব ফিল্টার রিসেট",
      collections_title: "বাছাই করা কালেকশন",
      col_library: "লাইব্রেরি কার্ড থাকলে",
      col_drama: "ড্রামা ও অ্যানিমে",
      col_lowdata: "কম ডেটায়",
      col_family: "পরিবারের সাথে",
      col_clear: "সব দেখাও",
      places_title: "দেশ অনুযায়ী দেখো",
      how_title: "সাইটগুলো কীভাবে বাছা হয়েছে",
      how1_t: "শুধু বৈধ লাইসেন্স",
      how1_b:
        "যে সার্ভিসগুলো স্টুডিওর সাথে চুক্তিতে কনটেন্ট দেখায় বা পাবলিক ডোমেইন ছবি দেয় — শুধু সেগুলোই তালিকায় আছে।",
      how2_t: "সত্যিকার অর্থে ফ্রি",
      how2_b:
        "সাইন-আপ বা কার্ড লাগলেও টাকা লাগে না। ফ্রি টিয়ার যেগুলোর পাশে প্রিমিয়াম আছে, সেটা রিভিউতে স্পষ্ট লেখা।",
      how3_t: "বিজ্ঞাপন ও কোয়ালিটি",
      how3_b:
        "প্লেয়ারের গতি, এইচডি সাপোর্ট আর বিজ্ঞাপনের পরিমাণ দেখে রেটিং দেওয়া হয়েছে — শুধু লাইব্রেরির আকার দেখে নয়।",
      how4_t: "অঞ্চল আলাদা করে",
      how4_b:
        "বেশিরভাগ ফ্রি সার্ভিস নির্দিষ্ট দেশে চলে। প্রতিটি কার্ডে লেখা আছে কোথায় কাজ করে, তাই হতাশ হতে হবে না।",
      how_note:
        "ⓘ রেটিং ও অঞ্চল সময়ের সাথে বদলায়। কোনো সাইট কোন দেশে চলে বা কোন সিরিজ আছে কি নেই — সেটা ওই সার্ভিসের নিজের পেজে দেখে নেওয়াই ভালো।",
      footer_text:
        "<strong>CineFree</strong> — একটি স্বাধীন ডাইরেক্টরি। আমরা কোনো ভিডিও হোস্ট করি না, শুধু বৈধ ফ্রি সার্ভিসের ঠিকানা দিই।",
      footer_updated: "সর্বশেষ হালনাগাদ: নভেম্বর ২০২৬",
      visits_total: "এখন পর্যন্ত {n} জন দেখেছেন",
      visits_today: "আজ {n} জন",
      btn_review: "রিভিউ পড়ো",
      btn_visit: "সাইটে যাও",
      editors: "এডিটরস চয়েস",
      sign_in: "সাইন ইন · সিঙ্ক",
      sign_out: "সাইন আউট",
      account_synced: "প্রিয় তালিকা সব ডিভাইসে সিঙ্ক হয়েছে",
      account_fallback: "তোমার অ্যাকাউন্ট",
      review_h2: "আমাদের রিভিউ",
      pros_h: "ভালো দিক",
      cons_h: "মনে রাখো",
      best_prefix: "কার জন্য সেরা:",
      facts_h2: "দ্রুত তথ্য",
      fact_rating: "রেটিং",
      fact_where: "কোথায় চলে",
      fact_region: "অঞ্চল",
      fact_ads: "বিজ্ঞাপন",
      fact_cats: "ক্যাটাগরি",
      fact_cost: "খরচ",
      cost_free: "সম্পূর্ণ ফ্রি",
      cost_ads: "ফ্রি (বিজ্ঞাপনসহ)",
      related_h2: "একই ধরনের আরও সাইট",
      back_all: "← সব সাইটে ফিরে যাও",
      notfound_title: "এই রিভিউটি পাওয়া যায়নি",
      notfound_text: "লিংকটা হয়তো পুরোনো। ডাইরেক্টরিতে ফিরে গিয়ে সাইট বেছে নাও।",
      notfound_cta: "ডাইরেক্টরিতে যাও",
      save_cta: "প্রিয় তালিকায় সেভ করো",
      saved_cta: "প্রিয় তালিকায় আছে",
      aside_editor: "এডিটরস চয়েস",
      aside_ours: "আমাদের মূল্যায়ন",
      of_five: "/৫",
      meta_title: "CineFree — সেরা ফ্রি মুভি ও সিরিজ দেখার ডাইরেক্টরি",
      review_meta: "সাইট রিভিউ",
      lang_label: "বাংলা",
      lang_switch: "English-এ দেখাও",
      theme_dark: "ডার্ক",
      theme_light: "লাইট",
      theme_switch: "{mode} মোডে যাও",
      stars_aria: "৫-এর মধ্যে {r}",
      rate_title: "ভিজিটরদের রেটিং",
      rate_votes: "{n}টি ভোট",
      rate_votes_one: "{n}টি ভোট",
      rate_none: "এখনো কেউ রেটিং দেয়নি — তুমিই প্রথম হতে পারো।",
      rate_your: "তোমার রেটিং দাও",
      rate_aria: "{s} তারা দাও",
      rate_thanks: "ধন্যবাদ! তোমার রেটিং সেভ হয়েছে।",
      rate_hint: "তারা-তে ক্লিক করলে রেটিং সেভ হবে।",
      install_app: "ইনস্টল",
      compare: "তুলনা",
      compare_add: "তুলনায় যোগ করো",
      compare_added: "তুলনা থেকে সরাও",
      compare_remove: "তুলনা থেকে সরাও",
      compare_full: "সর্বোচ্চ ৩টি সাইট একসাথে তুলনা করা যায়",
      compare_bar_n: "{n}টি সাইট বাছা হয়েছে",
      compare_go: "তুলনা করো",
      compare_clear: "মুছো",
      compare_page_title: "সাইট তুলনা",
      compare_sub:
        "পাশাপাশি দেখে ঠিক করো কোনটা তোমার জন্য — রেটিং, বিজ্ঞাপন, খরচ আর কোনটা কোন কাজে ভালো।",
      compare_empty_title: "তুলনার জন্য কিছু বাছা হয়নি",
      compare_empty_text:
        "ডাইরেক্টরির যেকোনো কার্ডে “তুলনা” বাটনে চাপ দাও — সর্বোচ্চ ৩টি সাইট পাশাপাশি দেখতে পারবে।",
      cmp_rating: "এডিটর রেটিং",
      cmp_ads: "বিজ্ঞাপন",
      cmp_cost: "খরচ",
      cmp_region: "কোথায় চলে",
      cmp_cats: "ক্যাটাগরি",
      cmp_best: "কার জন্য সেরা",
      cmp_pros: "ভালো দিক",
      cmp_cons: "মনে রাখো",
      cmp_verdict: "আমাদের রিভিউ",
      share: "শেয়ার",
      share_aria: "{name} — লিংক শেয়ার করো",
      share_copied: "লিংক কপি হয়েছে — এখন যেকোনো জায়গায় পেস্ট করো",
      share_fail: "লিংক কপি করা যায়নি",
      country_btn: "দেশ",
      country_menu_aria: "দেশ বেছে নাও",
      country_all: "সব দেশ",
      ads_0: "বিজ্ঞাপন নেই",
      ads_2: "বিজ্ঞাপন কম",
      ads_3: "বিজ্ঞাপন মাঝারি",
      ads_4: "বিজ্ঞাপন বেশি",
      ads_5: "বিজ্ঞাপন অনেক",
    },
    en: {
      brand_sub: "Free streaming directory",
      nav_dir: "Directory",
      nav_how: "How we pick",
      nav_back: "← Directory",
      hero_eyebrow: "{n} services · 2026",
      hero_title: 'Where to watch movies and series<br /><span>for free</span> — all in one place',
      hero_sub:
        "Only legal, genuinely free (ad-supported) services — no piracy sites, no junk pop-ups. Pick a category, search, and read a full review before you decide where to watch.",
      search_ph: "Search a site, show or language… (e.g. anime, Bangla, Hollywood)",
      search_aria: "Search sites",
      clear_aria: "Clear search",
      stat_services: "services",
      stat_cats: "categories",
      stat_legit: "legal & free",
      fav_only: "Favourites",
      label_region: "Region",
      label_sort: "Sort",
      sort_rating: "Rating (high to low)",
      sort_name: "Name (A–Z)",
      sort_ads: "Fewest ads",
      results_shown: "{n} sites shown",
      results_none: "No sites matched",
      empty_title: "Nothing found",
      empty_text: "Try another word, or reset the filters.",
      empty_fav_title: "No favourites yet",
      empty_fav_text: "Tap the heart on any site you like — it will be saved here.",
      empty_fav_after: "Save more sites and they will appear here.",
      empty_list: "Your list is empty now",
      reset_filters: "Reset all filters",
      collections_title: "Curated collections",
      col_library: "With a library card",
      col_drama: "Drama & anime",
      col_lowdata: "On low data",
      col_family: "Family friendly",
      col_clear: "Show everything",
      places_title: "Browse by country",
      how_title: "How these sites were chosen",
      how1_t: "Legal licences only",
      how1_b:
        "We list services that show content under studio deals or public-domain films — nothing else makes the cut.",
      how2_t: "Actually free",
      how2_b:
        "A sign-up or card may be needed, but no money changes hands. Where a free tier sits next to a premium plan, the review says so plainly.",
      how3_t: "Ads and playback quality",
      how3_b:
        "Ratings come from player reliability, HD support and how heavy the ads are — not just library size.",
      how4_t: "Region, stated clearly",
      how4_b:
        "Most free services only run in certain countries. Every card says where it works, so you are not left guessing.",
      how_note:
        "ⓘ Ratings and availability shift over time. Check the service's own page for what it carries in your country.",
      footer_text:
        "<strong>CineFree</strong> — an independent directory. We do not host any video; we only point to legal free services.",
      footer_updated: "Last updated: November 2026",
      visits_total: "{n} visitors so far",
      visits_today: "{n} today",
      btn_review: "Read review",
      btn_visit: "Visit site",
      editors: "Editor's choice",
      sign_in: "Sign in · sync",
      sign_out: "Sign out",
      account_synced: "Your favourites sync across devices",
      account_fallback: "Your account",
      review_h2: "Our review",
      pros_h: "What works",
      cons_h: "Keep in mind",
      best_prefix: "Best for:",
      facts_h2: "Quick facts",
      fact_rating: "Rating",
      fact_where: "Where it works",
      fact_region: "Region",
      fact_ads: "Ads",
      fact_cats: "Categories",
      fact_cost: "Cost",
      cost_free: "Completely free",
      cost_ads: "Free (with ads)",
      related_h2: "Similar sites",
      back_all: "← Back to all sites",
      notfound_title: "This review doesn't exist",
      notfound_text: "The link may be out of date. Head back to the directory and pick a site.",
      notfound_cta: "Go to the directory",
      save_cta: "Save to favourites",
      saved_cta: "In your favourites",
      aside_editor: "Editor's choice",
      aside_ours: "Our verdict",
      of_five: "/5",
      meta_title: "CineFree — the best free movie & series streaming directory",
      review_meta: "Site review",
      lang_label: "English",
      lang_switch: "Switch to Bangla",
      theme_dark: "Dark",
      theme_light: "Light",
      theme_switch: "Switch to {mode} mode",
      stars_aria: "{r} out of 5",
      rate_title: "Visitor rating",
      rate_votes: "{n} votes",
      rate_votes_one: "{n} vote",
      rate_none: "No ratings yet — be the first.",
      rate_your: "Rate this site",
      rate_aria: "Give {s} stars",
      rate_thanks: "Thanks! Your rating is saved.",
      rate_hint: "Click a star to save your rating.",
      install_app: "Install",
      compare: "Compare",
      compare_add: "Add to comparison",
      compare_added: "Remove from comparison",
      compare_remove: "Remove",
      compare_full: "You can compare three sites at a time",
      compare_bar_n: "{n} sites picked",
      compare_go: "Compare",
      compare_clear: "Clear",
      compare_page_title: "Compare sites",
      compare_sub:
        "See them side by side and decide — rating, ads, cost and what each one is best at.",
      compare_empty_title: "Nothing picked to compare",
      compare_empty_text:
        "Tap “Compare” on any card in the directory to line up to three sites side by side.",
      cmp_rating: "Editor rating",
      cmp_ads: "Ads",
      cmp_cost: "Cost",
      cmp_region: "Where it works",
      cmp_cats: "Categories",
      cmp_best: "Best for",
      cmp_pros: "What works",
      cmp_cons: "Keep in mind",
      cmp_verdict: "Our review",
      share: "Share",
      share_aria: "Share a link to {name}",
      share_copied: "Link copied — paste it anywhere",
      share_fail: "Could not copy the link",
      country_btn: "Country",
      country_menu_aria: "Choose your country",
      country_all: "All countries",
      ads_0: "No ads",
      ads_2: "Few ads",
      ads_3: "Moderate ads",
      ads_4: "Many ads",
      ads_5: "Lots of ads",
    },
  };

  var CATEGORY_LABELS = {
    bn: { all: "সব", movies: "মুভি", series: "সিরিজ", anime: "অ্যানিমে", live: "লাইভ টিভি", desi: "দেশি / দক্ষিণ এশিয়া", library: "লাইব্রেরি ও পাবলিক ডোমেইন" },
    en: { all: "All", movies: "Movies", series: "Series", anime: "Anime", live: "Live TV", desi: "Desi / South Asia", library: "Library & public domain" },
  };

  var REGION_LABELS = {
    bn: {
      all: "সব অঞ্চল",
      global: "বিশ্বব্যাপী",
      india: "ভারত",
      bangladesh: "বাংলাদেশ",
      us: "যুক্তরাষ্ট্র",
      europe: "ইউরোপ",
      uk: "যুক্তরাজ্য",
      germany: "জার্মানি",
      france: "ফ্রান্স",
      spain: "স্পেন",
      canada: "কানাডা",
      australia: "অস্ট্রেলিয়া",
      latam: "ল্যাটিন আমেরিকা",
      sea: "দক্ষিণ-পূর্ব এশিয়া",
    },
    en: {
      all: "All regions",
      global: "Worldwide",
      india: "India",
      bangladesh: "Bangladesh",
      us: "United States",
      europe: "Europe",
      uk: "United Kingdom",
      germany: "Germany",
      france: "France",
      spain: "Spain",
      canada: "Canada",
      australia: "Australia",
      latam: "Latin America",
      sea: "Southeast Asia",
    },
  };

  var bnDigits = { 0: "০", 1: "১", 2: "২", 3: "৩", 4: "৪", 5: "৫", 6: "৬", 7: "৭", 8: "৮", 9: "৯" };

  function t(key, vars) {
    var table = STRINGS[LANG] || STRINGS.en;
    var value = table[key];
    if (value === undefined) value = STRINGS.en[key];
    if (value === undefined) return key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        value = value.replace(new RegExp("\\{" + k + "\\}", "g"), vars[k]);
      });
    }
    return value;
  }

  function num(n) {
    if (LANG === "bn") return String(n).replace(/[0-9]/g, function (d) { return bnDigits[d]; });
    return String(n);
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
    location.reload();
  }

  function toggleLang() {
    setLang(LANG === "bn" ? "en" : "bn");
  }

  /* ---------- ডেটার ভাষা ---------- */
  function service(s) {
    var en = (typeof EN_SERVICES !== "undefined" && EN_SERVICES[s.id]) || null;
    if (LANG === "en" && en) return Object.assign({}, s, en);
    return s;
  }

  function categories() {
    return CATEGORIES.map(function (c) {
      return { key: c.key, label: (CATEGORY_LABELS[LANG] || CATEGORY_LABELS.en)[c.key] || c.label };
    });
  }

  function regions() {
    return REGIONS.map(function (r) {
      return { key: r.key, label: (REGION_LABELS[LANG] || REGION_LABELS.en)[r.key] || r.label };
    });
  }

  function adsLabel(n) {
    return t("ads_" + n) || t("ads_3");
  }

  /* ---------- স্ট্যাটিক টেক্সট বসানো ---------- */
  function applyStatic() {
    document.documentElement.setAttribute("lang", LANG);
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      const count = typeof SERVICES !== "undefined" ? SERVICES.length : 0;
      el.innerHTML = t(el.getAttribute("data-i18n-html"), { n: num(count) });
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph")));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    document.querySelectorAll("[data-lang-toggle]").forEach(function (btn) {
      btn.title = t("lang_switch");
      btn.setAttribute("aria-label", t("lang_switch"));
      var label = btn.querySelector(".lang-label");
      if (label) label.textContent = t("lang_label");
    });
    // পেজের টাইটেল
    if (window.PAGE_TITLE) {
      document.title =
        typeof window.PAGE_TITLE === "string"
          ? window.PAGE_TITLE
          : window.PAGE_TITLE[LANG] || window.PAGE_TITLE.en;
    } else if (document.body && document.body.dataset.page) {
      // review.js / compare-page.js পেজের নিজের টাইটেল বসায়
    } else {
      document.title = t("meta_title");
    }
  }

  /* ---------- দেশ শনাক্তকরণ (Worker-এর /api/geo) ---------- */
  function geoTune() {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return; // ব্যবহারকারী আগেই বেছে নিয়েছে
      if (sessionStorage.getItem("cinefree:geo")) return;
      sessionStorage.setItem("cinefree:geo", "1");
    } catch (e) {}

    fetch("/api/geo", { cache: "no-store" })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (data) {
        if (!data || !data.country) return;
        if ((data.country === "BD" || data.country === "IN") && LANG !== "bn") setLang("bn");
      })
      .catch(function () {});
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyStatic();
    document.querySelectorAll("[data-lang-toggle]").forEach(function (btn) {
      btn.addEventListener("click", toggleLang);
    });
    geoTune();
  });

  window.CF = {
    lang: LANG,
    t: t,
    num: num,
    setLang: setLang,
    toggleLang: toggleLang,
    service: service,
    categories: categories,
    regions: regions,
    adsLabel: adsLabel,
    categoryLabel: function (key) {
      return (CATEGORY_LABELS[LANG] || CATEGORY_LABELS.en)[key] || key;
    },
    regionLabel: function (key) {
      return (REGION_LABELS[LANG] || REGION_LABELS.en)[key] || key;
    },
  };
})();
