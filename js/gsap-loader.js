/* ========================================
   GSAP-LOADER.JS - Async GSAP Initializer
   Dynamically loads GSAP and plugins, ensuring
   they are properly registered before animations run.
   ======================================== */

const GSAPLoader = (function () {
  "use strict";

  let _ready = false;
  let _promise = null;

  const GSAP_CDN = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
  const ST_CDN   = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js";

  /**
   * Inject a <script> tag and return a Promise that resolves when loaded.
   * Prevents duplicates if the script is already in the DOM.
   */
  function _loadScript(src) {
    return new Promise(function (resolve, reject) {
      // Already in the DOM?
      var existing = document.querySelector('script[src="' + src + '"]');
      if (existing) {
        if (existing.dataset.loaded === "true") return resolve();
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", function () {
          reject(new Error("Script load failed: " + src));
        }, { once: true });
        return;
      }

      var s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = function () { s.dataset.loaded = "true"; resolve(); };
      s.onerror = function () { reject(new Error("Script load failed: " + src)); };
      document.head.appendChild(s);
    });
  }

  /**
   * Load GSAP core, then ScrollTrigger, register the plugin, and resolve.
   * Safe to call multiple times — deduplicates automatically.
   * Returns a Promise that resolves when GSAP + ScrollTrigger are ready.
   */
  function init() {
    if (_ready && typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      return Promise.resolve();
    }

    if (!_promise) {
      _promise = _loadScript(GSAP_CDN)
        .then(function () { return _loadScript(ST_CDN); })
        .then(function () {
          if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
            throw new Error("GSAP globals not found after script load.");
          }
          gsap.registerPlugin(ScrollTrigger);
          _ready = true;
        })
        .catch(function (err) {
          console.error("[GSAPLoader]", err);
          _promise = null;   // allow retry on next call
          _ready = false;
          return Promise.reject(err);   // propagate so callers can handle
        });
    }

    return _promise;
  }

  /**
   * Check if GSAP is loaded and ready synchronously.
   */
  function isReady() {
    return _ready;
  }

  return { init: init, isReady: isReady };
})();

window.GSAPLoader = GSAPLoader;
