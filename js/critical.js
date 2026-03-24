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

  // Build subcategory HTML for a given category (Vertical Accordion Style)
  function buildSubcategoryMenu(cat) {
    let html = '';
    cat.subcategories.forEach(sub => {
      if (typeof sub === 'string') {
        const link = `products.html?category=${encodeURIComponent(cat.name)}&sub=${encodeURIComponent(sub)}`;
        html += `<li><a class="submenu-item" href="${link}">${sub.toUpperCase()}</a></li>`;
      } else {
        // 3rd level (rare in this accordion, but we handle it)
        html += `<li class="submenu-inner-item">
          <div class="submenu-header">
            <a href="javascript:void(0)" class="prevent-nav">${sub.name.toUpperCase()}</a>
            <iconify-icon icon="mdi:chevron-down" class="submenu-icon"></iconify-icon>
          </div>
          <ul class="submenu-inner-list">
            ${sub.children.map(child => `<li><a class="submenu-item" href="products.html?category=${encodeURIComponent(cat.name)}&sub=${encodeURIComponent(sub.name + ' ' + child)}">${child.toUpperCase()}</a></li>`).join('')}
          </ul>
        </li>`;
      }
    });
    return html;
  }

  // Build Products accordion-style menu
  function buildProductsDropdown() {
    return NAV_CATEGORIES.map(cat => {
      const catLink = `products.html?category=${encodeURIComponent(cat.name)}`;
      return `
        <li class="accordion-item-custom">
          <div class="accordion-header-custom">
            <a class="accordion-link" href="${catLink}">${cat.name.toUpperCase()}</a>
            <iconify-icon icon="mdi:chevron-down" class="accordion-icon"></iconify-icon>
          </div>
          <div class="accordion-collapse-custom">
            <ul class="submenu-list">
              <li><a class="submenu-item" href="${catLink}">VIEW ALL</a></li>
              ${buildSubcategoryMenu(cat)}
            </ul>
          </div>
        </li>`;
    }).join('');
  }

  // ===== INJECT NAVBAR =====
  const navbarEl = document.getElementById("mainNavbar");
  if (navbarEl) {
    navbarEl.innerHTML = `
      <div class="container-fluid nav-shell">
        <a class="navbar-brand" href="index.html" aria-label="TheFaberTale home">
          <img src="images/FaberTaleBrandLogo.webp" alt="TheFaberTale">
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileNav" aria-controls="mobileNav" aria-label="Open menu">
          <iconify-icon icon="mdi:menu" width="24" height="24"></iconify-icon>
        </button>

        <div class="collapse navbar-collapse" id="desktopNav">
          <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-5">
            <li class="nav-item dropdown mega-dropdown">
              <a class="nav-link dropdown-toggle" href="products.html" role="button" data-bs-toggle="dropdown" aria-expanded="false">Products <iconify-icon icon="mdi:chevron-down" class="submenu-icon"></iconify-icon></a>
              <ul class="dropdown-menu mega-menu accordion-menu">
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

  // ===== DESKTOP ACCORDION BEHAVIOR =====
  const accordionHeaders = document.querySelectorAll('.accordion-header-custom');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function (e) {
      const item = this.parentElement;
      const isExpanded = item.classList.contains('active');

      // Close others (one-at-a-time accordion)
      document.querySelectorAll('.accordion-item-custom').forEach(el => {
        el.classList.remove('active');
        const icon = el.querySelector('.accordion-icon');
        if (icon) icon.setAttribute('icon', 'mdi:chevron-down');
      });

      if (!isExpanded) {
        item.classList.add('active');
        const icon = this.querySelector('.accordion-icon');
        if (icon) icon.setAttribute('icon', 'mdi:chevron-up');
      }

      // If clicking the link itself, allow navigation IF it's already expanded or if it's a direct click on the text
      // But user said "when clicked on dropdown link it should open in same place down"
      // So we prioritize toggle.
      if (e.target.classList.contains('accordion-link') && !isExpanded) {
        e.preventDefault();
      }
    });
  });

  // Handle nested submenus if any
  const submenuHeaders = document.querySelectorAll('.submenu-header');
  submenuHeaders.forEach(header => {
    header.addEventListener('click', function (e) {
      e.stopPropagation();
      const parent = this.parentElement; // .submenu-inner-item
      const isExpanded = parent.classList.contains('active');

      // Toggle active class
      parent.classList.toggle('active');

      const icon = this.querySelector('.submenu-icon');
      if (icon) {
        icon.setAttribute('icon', !isExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down');
      }

      // Always prevent default if it's a prevent-nav link or a toggle container
      if (e.target.classList.contains('prevent-nav') || e.target.closest('.submenu-header')) {
        e.preventDefault();
      }
    });
  });

  // Keep the main mega-menu open on hover or click
  const megaDropdown = document.querySelector('.mega-dropdown');
  if (megaDropdown) {
    // We already have Bootstrap handling the main dropdown toggle
    // But we might want to prevent it from closing when clicking inside
    const megaMenu = megaDropdown.querySelector('.mega-menu');
    if (megaMenu) {
      megaMenu.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }
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
    // Skip Bootstrap components that use href for target IDs (like collapse/tabs)
    if (link.hasAttribute('data-bs-toggle')) return;

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
