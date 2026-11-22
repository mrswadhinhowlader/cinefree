/* Registers the service worker and shows the "install app" button
   only when the browser actually offers an install prompt. */
(function () {
  if ("serviceWorker" in navigator && location.protocol === "https:") {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/sw.js").catch(function () {});
    });
  }

  var btn = document.getElementById("install-app");
  var prompt = null;

  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    prompt = event;
    if (btn) btn.hidden = false;
  });

  if (btn) {
    btn.addEventListener("click", function () {
      if (!prompt) return;
      prompt.prompt();
      promiseDone(prompt.userChoice);
      prompt = null;
      btn.hidden = true;
    });
  }

  window.addEventListener("appinstalled", function () {
    prompt = null;
    if (btn) btn.hidden = true;
  });

  function promiseDone(result) {
    if (result && typeof result.then === "function") result.then(function () {}).catch(function () {});
  }
})();
