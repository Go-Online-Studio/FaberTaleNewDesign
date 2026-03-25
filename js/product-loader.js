/* ========================================
   PRODUCT-LOADER.JS - Product Grid Renderer
   Adapted from blog-posts.js
   Used on products.html for listing page
   ======================================== */

let currentFilter = "all";
let currentSubFilter = "all";
let currentSearch = "";
let allProducts = [];
let allCategories = [];

document.addEventListener("DOMContentLoaded", () => {
  loadProductsData();
});

async function loadProductsData() {
  try {
    const paths = ["products.json", "./products.json"];
    let data = null;

    for (const path of paths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          data = await response.json();
          break;
        }
      } catch (e) { continue; }
    }

    if (data && data.products) {
      allProducts = data.products;
      allCategories = data.categories || [];
      initializePage();
    } else {
      const grid = document.getElementById("productGrid");
      if (grid) grid.innerHTML =
        '<div class="col-12"><div class="alert alert-warning text-center">Unable to load products. Please try again later.</div></div>';
    }
  } catch (error) {
    console.error("Error loading products:", error);
    const grid = document.getElementById("productGrid");
    if (grid) grid.innerHTML =
      '<div class="col-12"><div class="alert alert-danger text-center">Error loading products. Please try again later.</div></div>';
  }
}

function initializePage() {
  generateCategoryFilters();
  checkURLParams();
  displayProducts(allProducts);
  setupEventListeners();
}

function checkURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");
  const sub = urlParams.get("sub");

  if (category) {
    currentFilter = category;
    setTimeout(() => {
      document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("active");
        if (btn.dataset.category === category) {
          btn.classList.add("active");
        }
      });

      // If subcategory is specified, also filter by it
      if (sub) {
        currentSubFilter = sub;
        // Update sub-filter buttons if they exist
        document.querySelectorAll(".sub-filter-btn").forEach(btn => {
          btn.classList.remove("active");
          if (btn.dataset.sub === sub) {
            btn.classList.add("active");
          }
        });
      }

      filterAndDisplayProducts();
    }, 50);
  }
}

function generateCategoryFilters() {
  const categories = ["all", ...new Set(allProducts.map(p => p.category))];
  const container = document.getElementById("categoryFilters");

  if (container) {
    container.innerHTML = categories
      .map(cat =>
        `<button class="filter-btn ${cat === "all" ? "active" : ""}" data-category="${cat}">
          ${cat === "all" ? "All" : cat}
        </button>`
      )
      .join("");

    container.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", handleCategoryFilter);
    });
  }
}

function generateSubcategoryFilters(category) {
  const container = document.getElementById("subcategoryFilters");
  if (!container) return;

  if (category === "all") {
    container.innerHTML = "";
    currentSubFilter = "all";
    return;
  }

  const catData = allCategories.find(c => c.name === category);
  if (!catData || !catData.subcategories || catData.subcategories.length === 0) {
    container.innerHTML = "";
    currentSubFilter = "all";
    return;
  }

  // Flatten subcategories (handle nested objects for Lights)
  const subs = [];
  catData.subcategories.forEach(sub => {
    if (typeof sub === 'string') {
      subs.push(sub);
    } else if (sub.children) {
      sub.children.forEach(child => subs.push(sub.name + ' ' + child));
    }
  });

  container.innerHTML = `
    <label class="filter-label" style="margin-top:12px;">Subcategory:</label>
    <div class="filter-buttons">
      <button class="sub-filter-btn filter-btn active" data-sub="all">All</button>
      ${subs.map(s => `<button class="sub-filter-btn filter-btn ${currentSubFilter === s ? 'active' : ''}" data-sub="${s}">${s}</button>`).join('')}
    </div>`;

  container.querySelectorAll(".sub-filter-btn").forEach(btn => {
    btn.addEventListener("click", handleSubcategoryFilter);
  });
}

function setupEventListeners() {
  const searchInput = document.getElementById("productSearch");
  if (searchInput) {
    searchInput.addEventListener("input", debounce(handleSearch, 300));
  }
}

function handleSearch(e) {
  currentSearch = e.target.value.toLowerCase();
  filterAndDisplayProducts();
}

function handleCategoryFilter(e) {
  document.querySelectorAll(".filter-btn:not(.sub-filter-btn)").forEach(btn => btn.classList.remove("active"));
  e.target.classList.add("active");
  currentFilter = e.target.dataset.category;
  currentSubFilter = "all";
  generateSubcategoryFilters(currentFilter);
  updateURLParams(currentFilter, currentSubFilter);
  filterAndDisplayProducts();
}

function handleSubcategoryFilter(e) {
  document.querySelectorAll(".sub-filter-btn").forEach(btn => btn.classList.remove("active"));
  e.target.classList.add("active");
  currentSubFilter = e.target.dataset.sub;
  updateURLParams(currentFilter, currentSubFilter);
  filterAndDisplayProducts();
}

function updateURLParams(category, sub) {
  const url = new URL(window.location);
  if (category && category !== "all") {
    url.searchParams.set("category", category);
  } else {
    url.searchParams.delete("category");
  }
  
  if (sub && sub !== "all") {
    url.searchParams.set("sub", sub);
  } else {
    url.searchParams.delete("sub");
  }
  
  window.history.replaceState({}, "", url);
}

function filterAndDisplayProducts() {
  let filtered = allProducts;

  if (currentFilter !== "all") {
    filtered = filtered.filter(p => p.category === currentFilter);
  }

  if (currentSubFilter !== "all") {
    filtered = filtered.filter(p => p.subcategory === currentSubFilter);
  }

  if (currentSearch) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(currentSearch) ||
      p.description.toLowerCase().includes(currentSearch) ||
      (p.tags || []).some(t => t.toLowerCase().includes(currentSearch)) ||
      p.category.toLowerCase().includes(currentSearch) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(currentSearch))
    );
  }

  displayProducts(filtered);
}

function displayProducts(products) {
  const grid = document.getElementById("productGrid");
  const noResults = document.getElementById("noResults");
  const resultsCount = document.getElementById("resultsCount");

  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = "";
    if (noResults) noResults.classList.remove("d-none");
    if (resultsCount) resultsCount.textContent = "";
  } else {
    if (noResults) noResults.classList.add("d-none");
    if (resultsCount) {
      resultsCount.textContent = `Showing ${products.length} ${products.length === 1 ? "product" : "products"}`;
    }
    grid.innerHTML = products.map(p => createProductCard(p)).join("");
  }
}

function createProductCard(product) {
  return `
    <div class="col-lg-4 col-md-4 col-6" data-aos="fade-up">
      <div class="productCard">
        <a class="anchorAbs" href="product-detail.html?id=${product.id}" aria-label="${product.name}"></a>
        <span class="quick-enquiry-badge">Quick Enquiry</span>
        <div class="hoverWrapper">
          <img loading="lazy" class="mainImg" src="${product.images[0]}" alt="${product.name}">
          <img loading="lazy" class="hoverImg" src="${product.images[1] || product.images[0]}" alt="${product.name}">
        </div>
        <div class="productInfo">
          <h5>${product.name}</h5>
          <span class="tag">${product.subcategory || product.category}</span>
        </div>
      </div>
    </div>`;
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
