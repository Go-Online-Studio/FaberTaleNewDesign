/* ========================================
   SCRIPT.JS - Common Utilities
   Shared functionality across all pages
   ======================================== */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // ===== CONFIGURATION =====
  const CONFIG = {
    whatsappNumber: "917016738803",
    animationDuration: 800,
    debounceDelay: 250,
  };

  // ===== INJECT FOOTER =====
  const footerEl = document.getElementById("footer");
  if (footerEl) {
    footerEl.innerHTML = `
    <div class="container">
      <div class="footWrap">
        <div class="row">
          <!-- Brand -->
          <div class="col-lg-4 col-md-6 mb-4 mb-lg-0">
            <a class="footer-brand" href="index.html">
              <span style="font-size:1.3rem;font-weight:700;letter-spacing:1px;color:var(--white);">The<span style="color:var(--accent);">Faber</span>Tale</span>
            </a>
            <p>Handcrafted furniture and décor artifacts that bring artisan beauty into your home. Each piece tells a story of craftsmanship and natural elegance.</p>
            <div class="socials" aria-label="Social links">
              <a href="#" aria-label="Facebook"><iconify-icon icon="mdi:facebook"></iconify-icon></a>
              <a href="#" aria-label="Instagram"><iconify-icon icon="mdi:instagram"></iconify-icon></a>
              <a href="#" aria-label="Pinterest"><iconify-icon icon="mdi:pinterest"></iconify-icon></a>
              <a href="#" aria-label="YouTube"><iconify-icon icon="mdi:youtube"></iconify-icon></a>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="col-lg-2 col-md-6 col-6 mb-4 mb-lg-0">
            <h5>Explore</h5>
            <ul class="footer-links">
              <li><a href="products.html">Products</a></li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
          </div>

          <!-- Categories -->
          <div class="col-lg-2 col-md-6 col-6 mb-4 mb-lg-0">
            <h5>Categories</h5>
            <ul class="footer-links">
              <li><a href="products.html?category=Tables">Tables</a></li>
              <li><a href="products.html?category=Sculptures">Sculptures</a></li>
              <li><a href="products.html?category=Wall Art">Wall Art</a></li>
              <li><a href="products.html?category=Lighting">Lighting</a></li>
              <li><a href="products.html?category=Décor Accents">Décor Accents</a></li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div class="col-lg-4 col-md-6 mb-4 mb-lg-0">
            <h5>Get In Touch</h5>
            <ul class="contact-info">
              <li>
                <a href="tel:+917016738803">
                  <iconify-icon icon="mdi:phone-outline"></iconify-icon> +91 7016738803
                </a>
              </li>
              <li>
                <a href="mailto:info@thefabertale.com">
                  <iconify-icon icon="mdi:email-outline"></iconify-icon> info@thefabertale.com
                </a>
              </li>
              <li>
                <a href="https://maps.app.goo.gl" target="_blank">
                  <iconify-icon icon="mdi:map-marker-outline"></iconify-icon> Vadodara, Gujarat, India
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="f-bottom">
      <div class="container">
        <div class="copyright">
          © <span id="year"></span> TheFaberTale. All Rights Reserved.
        </div>
      </div>
    </div>`;
  }

  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== WHATSAPP FAB =====
  (function () {
    const mobileLink = `https://api.whatsapp.com/send?phone=${CONFIG.whatsappNumber}`;
    const desktopLink = `https://web.whatsapp.com/send?phone=${CONFIG.whatsappNumber}`;

    function isMobileDevice() {
      return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    }

    function updateWhatsAppLink() {
      const isMobile = isMobileDevice();
      const targetLink = isMobile ? mobileLink : desktopLink;

      document.querySelectorAll(".set-url-target").forEach((el) => {
        el.setAttribute("href", targetLink);
      });
    }

    window.addEventListener("resize", updateWhatsAppLink);
    window.addEventListener("load", updateWhatsAppLink);
  })();

  // ===== INITIALIZE AOS =====
  if (typeof AOS !== "undefined") {
    AOS.init({
      once: true,
      duration: CONFIG.animationDuration,
      offset: 80,
      easing: "ease-out-cubic",
    });

    setTimeout(() => {
      AOS.refresh();
    }, 100);
  }

  // ===== DEBOUNCE =====
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ===== RESIZE LISTENER =====
  const handleResize = debounce(function () {
    if (typeof AOS !== "undefined") {
      AOS.refresh();
    }
  }, CONFIG.debounceDelay);

  window.addEventListener("resize", handleResize);

  // ===== BACK TO TOP =====
  const backToTop = document.getElementById("backToTop");

  function handleBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > 500) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  }

  window.addEventListener("scroll", handleBackToTop, { passive: true });

  if (backToTop) {
    backToTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
