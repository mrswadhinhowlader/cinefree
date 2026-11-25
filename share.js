/* Share a service link and show a small toast.
   Phones get the native share sheet (real taps only), everything else gets
   the link copied; if copying is blocked the toast shows the link itself. */
(function () {
  var t = CF.t;
  var toastEl = null;
  var toastTimer = null;

  function toast(message) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "cf-toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("show");
    }, 3200);
  }

  window.CFNotify = toast;

  function legacyCopy(text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (err) {
      return false;
    }
  }

  function copyText(text) {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      return Promise.resolve(legacyCopy(text));
    }
    var writing = navigator.clipboard.writeText(text).then(
      function () {
        return true;
      },
      function () {
        return null;
      }
    );
    // a blocked permission prompt must not leave the button hanging
    var timeout = new Promise(function (resolve) {
      setTimeout(function () {
        resolve(null);
      }, 1500);
    });
    return Promise.race([writing, timeout]).then(function (ok) {
      return ok === true ? true : legacyCopy(text);
    });
  }

  function reviewUrl(id) {
    return new URL("review?id=" + encodeURIComponent(id), location.href).href;
  }

  window.CFShare = function (id, allowNative) {
    var base = (typeof SERVICES !== "undefined" ? SERVICES : []).find(function (s) {
      return s.id === id;
    });
    var name = base ? CF.service(base).name : "CineFree";
    var url = reviewUrl(id);

    if (allowNative && navigator.share && navigator.canShare) {
      var payload = { title: name + " — CineFree", text: name, url: url };
      if (navigator.canShare(payload)) {
        return navigator.share(payload).catch(function (err) {
          if (err && err.name === "AbortError") return;
          copyText(url).then(function (ok) {
            toast(ok ? t("share_copied") : t("share_fail") + " " + url);
          });
        });
      }
    }

    return copyText(url).then(function (ok) {
      toast(ok ? t("share_copied") : t("share_fail") + " " + url);
    });
  };

  document.addEventListener("click", function (event) {
    var btn = event.target.closest("[data-share]");
    if (!btn) return;
    event.preventDefault();
    window.CFShare(btn.getAttribute("data-share"), event.isTrusted === true);
  });
})();
