/* ========================================
   CRITICAL.JS - Navigation & Core Interactions
   3-Level Deep Mega Menu + Core Functionality
   ======================================== */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // ===== CATEGORY STRUCTURE (3-level deep) =====
  const NAV_CATEGORIES = [
    {
      name: "Beds",
      subcategories: ["Canopy Bed"]
    },
    {
      name: "Tables",
      subcategories: ["Dining Table", "Center Table", "Side Table", "Console Table", "Live Edge"]
    },
    {
      name: "Lights",
      subcategories: [
        { name: "Papermesh", children: ["Floor", "Hanging"] },
        { name: "Wooden", children: ["Floor", "Hanging"] }
      ]
    },
    {
      name: "Benches",
      subcategories: ["Papermesh", "Wood"]
    },
    {
      name: "Chairs",
      subcategories: ["All Chairs"]
    },
    {
      name: "Mirrors",
      subcategories: ["Hanging", "Floor"]
    },
    {
      name: "Pots/Vases",
      subcategories: ["Papermesh", "Wood"]
    },
    {
      name: "Artifacts",
      subcategories: ["All Artifacts"]
    }
  ];

  // Build subcategory HTML for a given category
  function buildSubcategoryMenu(cat) {
    let html = '';
    cat.subcategories.forEach(sub => {
      if (typeof sub === 'string') {
        const link = `products.html?category=${encodeURIComponent(cat.name)}&sub=${encodeURIComponent(sub)}`;
        html += `<li><a class="dropdown-item" href="${link}">${sub}</a></li>`;
      } else {
        // 3rd level: sub has children
        html += `<li class="dropdown-submenu">
          <a class="dropdown-item dropdown-toggle" href="products.html?category=${encodeURIComponent(cat.name)}&sub=${encodeURIComponent(sub.name)}">${sub.name}</a>
          <ul class="dropdown-menu submenu-level-3">
            ${sub.children.map(child => `<li><a class="dropdown-item" href="products.html?category=${encodeURIComponent(cat.name)}&sub=${encodeURIComponent(sub.name + ' ' + child)}">${child}</a></li>`).join('')}
          </ul>
        </li>`;
      }
    });
    return html;
  }

  // Build Products mega-menu
  function buildProductsDropdown() {
    return NAV_CATEGORIES.map(cat => {
      const catLink = `products.html?category=${encodeURIComponent(cat.name)}`;
      return `<li class="dropdown-submenu">
        <a class="dropdown-item dropdown-toggle" href="${catLink}">${cat.name}</a>
        <ul class="dropdown-menu submenu-level-2">
          <li><a class="dropdown-item" href="${catLink}"><strong>All ${cat.name}</strong></a></li>
          <li><hr class="dropdown-divider"></li>
          ${buildSubcategoryMenu(cat)}
        </ul>
      </li>`;
    }).join('');
  }

  // ===== INJECT NAVBAR =====
  const navbarEl = document.getElementById("mainNavbar");
  if (navbarEl) {
    navbarEl.innerHTML = `
      <div class="container-fluid nav-shell">
        <a class="navbar-brand" href="index.html" aria-label="TheFaberTale home">
          <span style="font-size:1.4rem;font-weight:700;letter-spacing:1px;color:var(--dark);">The<span style="color:var(--accent);">Faber</span>Tale</span>
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileNav" aria-controls="mobileNav" aria-label="Open menu">
          <iconify-icon icon="mdi:menu" width="24" height="24"></iconify-icon>
        </button>

        <div class="collapse navbar-collapse" id="desktopNav">
          <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-5">
            <li class="nav-item dropdown mega-dropdown">
              <a class="nav-link dropdown-toggle" href="products.html" role="button" data-bs-toggle="dropdown" aria-expanded="false">Products</a>
              <ul class="dropdown-menu mega-menu">
                <li><a class="dropdown-item" href="products.html"><strong>All Products</strong></a></li>
                <li><hr class="dropdown-divider"></li>
                ${buildProductsDropdown()}
              </ul>
            </li>
            <li class="nav-item"><a class="nav-link" href="gallery.html">Gallery</a></li>
            <li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>
            <li class="nav-item">
              <button class="nav-search-btn" type="button" data-bs-toggle="modal" data-bs-target="#searchModal" aria-label="Search products">
                <iconify-icon icon="mdi:magnify" width="22" height="22"></iconify-icon>
              </button>
            </li>
          </ul>
        </div>
      </div>`;
  }

  // ===== INJECT MOBILE NAV (Accordion-style 3-level) =====
  function buildMobileSubcategory(cat) {
    return cat.subcategories.map(sub => {
      if (typeof sub === 'string') {
        const link = `products.html?category=${encodeURIComponent(cat.name)}&sub=${encodeURIComponent(sub)}`;
        return `<li><a class="nav-link ps-4" href="${link}">${sub}</a></li>`;
      } else {
        const subId = `mob-${cat.name}-${sub.name}`.replace(/[^a-zA-Z0-9]/g, '');
        return `<li>
          <a class="nav-link ps-4" data-bs-toggle="collapse" href="#${subId}" role="button" aria-expanded="false">${sub.name} <iconify-icon icon="mdi:chevron-down" width="16"></iconify-icon></a>
          <div class="collapse" id="${subId}">
            <ul class="navbar-nav">
              ${sub.children.map(child => `<li><a class="nav-link ps-5" href="products.html?category=${encodeURIComponent(cat.name)}&sub=${encodeURIComponent(sub.name + ' ' + child)}">${child}</a></li>`).join('')}
            </ul>
          </div>
        </li>`;
      }
    }).join('');
  }

  function buildMobileCategories() {
    return NAV_CATEGORIES.map(cat => {
      const catId = `mob-${cat.name}`.replace(/[^a-zA-Z0-9]/g, '');
      return `<li class="nav-item">
        <a class="nav-link" data-bs-toggle="collapse" href="#${catId}" role="button" aria-expanded="false">
          ${cat.name} <iconify-icon icon="mdi:chevron-down" width="16"></iconify-icon>
        </a>
        <div class="collapse" id="${catId}">
          <ul class="navbar-nav">
            <li><a class="nav-link ps-3" href="products.html?category=${encodeURIComponent(cat.name)}"><strong>All ${cat.name}</strong></a></li>
            ${buildMobileSubcategory(cat)}
          </ul>
        </div>
      </li>`;
    }).join('');
  }

  const mobileNavEl = document.getElementById("mobileNav");
  if (mobileNavEl) {
    mobileNavEl.innerHTML = `
      <div class="offcanvas-header">
        <h2 id="mobileNavLabel" class="offcanvas-title">TheFaberTale</h2>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close menu"></button>
      </div>
      <div class="offcanvas-body">
        <ul class="navbar-nav gap-0">
          <li class="nav-item">
            <a class="nav-link" href="products.html"><strong>All Products</strong></a>
          </li>
          ${buildMobileCategories()}
          <li class="nav-item"><a class="nav-link" href="gallery.html">Gallery</a></li>
          <li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>
          <li class="nav-item mt-3">
            <button class="btn btn-outline-light w-100" type="button" data-bs-toggle="modal" data-bs-target="#searchModal" data-bs-dismiss="offcanvas">
              <iconify-icon icon="mdi:magnify"></iconify-icon> Search Products
            </button>
          </li>
        </ul>
      </div>`;
  }

  // ===== DESKTOP SUBMENU HOVER BEHAVIOR =====
  const submenus = document.querySelectorAll('.dropdown-submenu');
  submenus.forEach(item => {
    item.addEventListener('mouseenter', function () {
      const sub = this.querySelector('.dropdown-menu');
      if (sub) sub.classList.add('show');
    });
    item.addEventListener('mouseleave', function () {
      const sub = this.querySelector('.dropdown-menu');
      if (sub) sub.classList.remove('show');
    });
  });

  // Keep the main mega-menu open on hover
  const megaDropdown = document.querySelector('.mega-dropdown');
  if (megaDropdown) {
    megaDropdown.addEventListener('mouseenter', function () {
      const menu = this.querySelector('.mega-menu');
      if (menu) menu.classList.add('show');
      const toggle = this.querySelector('.dropdown-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
    });
    megaDropdown.addEventListener('mouseleave', function () {
      const menu = this.querySelector('.mega-menu');
      if (menu) menu.classList.remove('show');
      const toggle = this.querySelector('.dropdown-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  }

  // ===== ACTIVE LINK HANDLING =====
  function setActiveNavItem() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    navLinks.forEach((link) => {
      link.classList.remove("active");
      const linkHref = link.getAttribute("href");
      if (linkHref && linkHref.split("?")[0] === currentPage) {
        link.classList.add("active");
      }
    });
  }
  setActiveNavItem();

  // ===== NAVBAR SCROLL BEHAVIOR =====
  const navbar = document.getElementById("mainNavbar");
  const onScrollState = () => {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 18);
  };
  window.addEventListener("scroll", onScrollState, { passive: true });
  onScrollState();

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      if (href === "#") { e.preventDefault(); return; }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 72;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPosition, behavior: "smooth" });
      }
    });
  });
});
