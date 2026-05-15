/* ========================================
   GSAP-LOADER.JS - Async GSAP Initializer
   Dynamically loads GSAP and plugins, ensuring
   they are properly registered before animations run.
   ======================================== */

const GSAPLoader = (function () {
  let isLoaded = false;
  let loadingPromise = null;

  const GSAP_URL = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
  const SCROLLTRIGGER_URL = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js";

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        // If it's already in the DOM, wait for it to load if it hasn't already
        if (existingScript.getAttribute('data-loaded') === 'true') {
          resolve();
        } else {
          existingScript.addEventListener("load", resolve, { once: true });
          existingScript.addEventListener("error", reject, { once: true });
        }
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        script.setAttribute('data-loaded', 'true');
        resolve();
      };
      script.onerror = () => {
        console.error(`Failed to load script: ${src}`);
        reject(new Error(`Script load error for ${src}`));
      };

      document.head.appendChild(script);
    });
  }

  function init() {
    if (isLoaded) return Promise.resolve();

    if (!loadingPromise) {
      loadingPromise = loadScript(GSAP_URL)
        .then(() => loadScript(SCROLLTRIGGER_URL))
        .then(() => {
          if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
            gsap.registerPlugin(ScrollTrigger);
            isLoaded = true;
          } else {
            throw new Error("GSAP or ScrollTrigger failed to initialize globally.");
          }
        })
        .catch((error) => {
          console.error("GSAP Loader Error:", error);
          // Allow retry on failure
          loadingPromise = null;
        });
    }

    return loadingPromise;
  }

  return { init };
})();

window.GSAPLoader = GSAPLoader;
