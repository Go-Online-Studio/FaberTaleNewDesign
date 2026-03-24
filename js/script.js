/* ========================================
   SCRIPT.JS - Common Utilities
   Shared functionality across all pages
   ======================================== */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // ===== CONFIGURATION =====
  const CONFIG = {
    whatsappNumber: "917016738803",
    callNumber: "+917016738803",
    animationDuration: 800,
    debounceDelay: 250,
  };
  window.THE_FABER_TALE_CONFIG = CONFIG;

  // ===== INJECT FOOTER =====
  const footerEl = document.getElementById("footer");
  if (footerEl) {
    footerEl.innerHTML = `
    <div class="footer-accent-top"></div>
    <div class="container-fluid px-4 px-md-5">
      <div class="footWrap">
        <div class="row gy-4">
          <!-- Brand -->
          <div class="fCol1 col-md-6 " data-aos="fade-up">
            <a class="footer-brand" href="index.html">
              <img src="images/FaberTaleBrandLogoWhite.webp" alt="TheFaberTale">
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
          <div class="fCol2 col-md-6 col-6 " data-aos="fade-up" data-aos-delay="50">
            <h5>Explore</h5>
            <ul class="footer-links">
              <li><a href="products.html">Products</a></li>
              <li><a href="gallery.html">Gallery</a></li>
              <li><a href="about.html">About Us</a></li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
          </div>

          <!-- Categories -->
          <div class="fCol3 col-md-6 col-6 " data-aos="fade-up" data-aos-delay="100">
            <h5>Categories</h5>
            <ul class="footer-links">
              <li><a href="products.html?category=Beds">Beds</a></li>
              <li><a href="products.html?category=Tables">Tables</a></li>
              <li><a href="products.html?category=Lights">Lights</a></li>
              <li><a href="products.html?category=Chairs">Chairs</a></li>
              <li><a href="products.html?category=Mirrors">Mirrors</a></li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div class="fCol4 col-md-6 " data-aos="fade-up" data-aos-delay="150">
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
                <a href="https://maps.app.goo.gl/Q8x9iVAoAnDqr2Px8" target="_blank">
                  <iconify-icon icon="mdi:map-marker-outline"></iconify-icon> Vadodara, Gujarat, India
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="f-bottom">
      <div class="container-fluid px-4 px-md-5">
        <div class="copyright">
          © <span id="year"></span> TheFaberTale. All Rights Reserved.
        </div>
      </div>
    </div>`;
  }

  // ===== INJECT FAB BUTTONS =====
  const injectFABs = () => {
    // Check if container already exists to avoid duplicates
    if (document.getElementById("dynamic-fabs")) return;

    const fabContainer = document.createElement("div");
    fabContainer.id = "dynamic-fabs";

    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const whatsappUrl = isMobile 
      ? `https://api.whatsapp.com/send?phone=${CONFIG.whatsappNumber}`
      : `https://web.whatsapp.com/send?phone=${CONFIG.whatsappNumber}`;

    fabContainer.innerHTML = `
      <!-- WhatsApp FAB -->
      <div class="fab-container">
        <a href="${whatsappUrl}" rel="noopener" target="_blank" aria-label="Chat on WhatsApp">
          <svg xmlns="http://www.w3.org/2000/svg" width="23.82" height="24" viewBox="0 0 256 258">
            <defs>
              <linearGradient id="SVGBRLHCcSy" x1="50%" x2="50%" y1="100%" y2="0%">
                <stop offset="0%" stop-color="#1faf38"/><stop offset="100%" stop-color="#60d669"/>
              </linearGradient>
              <linearGradient id="SVGHW6lecxh" x1="50%" x2="50%" y1="100%" y2="0%">
                <stop offset="0%" stop-color="#f9f9f9"/><stop offset="100%" stop-color="#fff"/>
              </linearGradient>
            </defs>
            <path fill="url(#SVGBRLHCcSy)" d="M5.463 127.456c-.006 21.677 5.658 42.843 16.428 61.499L4.433 252.697l65.232-17.104a123 123 0 0 0 58.8 14.97h.054c67.815 0 123.018-55.183 123.047-123.01c.013-32.867-12.775-63.773-36.009-87.025c-23.23-23.25-54.125-36.061-87.043-36.076c-67.823 0-123.022 55.18-123.05 123.004"/>
            <path fill="url(#SVGHW6lecxh)" d="M1.07 127.416c-.007 22.457 5.86 44.38 17.014 63.704L0 257.147l67.571-17.717c18.618 10.151 39.58 15.503 60.91 15.511h.055c70.248 0 127.434-57.168 127.464-127.423c.012-34.048-13.236-66.065-37.3-90.15C194.633 13.286 162.633.014 128.536 0C58.276 0 1.099 57.16 1.071 127.416m40.24 60.376l-2.523-4.005c-10.606-16.864-16.204-36.352-16.196-56.363C22.614 69.029 70.138 21.52 128.576 21.52c28.3.012 54.896 11.044 74.9 31.06c20.003 20.018 31.01 46.628 31.003 74.93c-.026 58.395-47.551 105.91-105.943 105.91h-.042c-19.013-.01-37.66-5.116-53.922-14.765l-3.87-2.295l-40.098 10.513z"/>
            <path fill="#fff" d="M96.678 74.148c-2.386-5.303-4.897-5.41-7.166-5.503c-1.858-.08-3.982-.074-6.104-.074c-2.124 0-5.575.799-8.492 3.984c-2.92 3.188-11.148 10.892-11.148 26.561s11.413 30.813 13.004 32.94c1.593 2.123 22.033 35.307 54.405 48.073c26.904 10.609 32.379 8.499 38.218 7.967c5.84-.53 18.844-7.702 21.497-15.139c2.655-7.436 2.655-13.81 1.859-15.142c-.796-1.327-2.92-2.124-6.105-3.716s-18.844-9.298-21.763-10.361c-2.92-1.062-5.043-1.592-7.167 1.597c-2.124 3.184-8.223 10.356-10.082 12.48c-1.857 2.129-3.716 2.394-6.9.801c-3.187-1.598-13.444-4.957-25.613-15.806c-9.468-8.442-15.86-18.867-17.718-22.056c-1.858-3.184-.199-4.91 1.398-6.497c1.431-1.427 3.186-3.719 4.78-5.578c1.588-1.86 2.118-3.187 3.18-5.311c1.063-2.126.531-3.986-.264-5.579c-.798-1.593-6.987-17.343-9.819-23.64" stroke-width="6.5" stroke="#fff"/>
          </svg>
        </a>
      </div>
      <!-- Call FAB -->
      <div class="Call-fab-container">
        <a href="tel:${CONFIG.callNumber}" rel="noopener" aria-label="Call us">
          <iconify-icon icon="mdi:phone" style="color:#fff;font-size:1.4rem;"></iconify-icon>
        </a>
      </div>
    `;
    document.body.appendChild(fabContainer);
  };

  injectFABs();

  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== UPDATE WHATSAPP LINKS ON RESIZE (Optional) =====
  // This handles any other .set-url-target elements that might be in the static HTML
  const updateStaticWhatsAppLinks = () => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const targetLink = isMobile 
      ? `https://api.whatsapp.com/send?phone=${CONFIG.whatsappNumber}`
      : `https://web.whatsapp.com/send?phone=${CONFIG.whatsappNumber}`;

    document.querySelectorAll(".set-url-target").forEach((el) => {
      el.setAttribute("href", targetLink);
    });
  };

  window.addEventListener("resize", updateStaticWhatsAppLinks);
  window.addEventListener("load", updateStaticWhatsAppLinks);

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
