/* ========================================
   PRODUCT-MANAGER.JS - Search & Filter Engine
   Adapted from blog-manager.js
   ======================================== */

class ProductManager {
  constructor() {
    this.products = [];
    this.currentProductId = null;
  }

  async init() {
    await this.loadProducts();
    this.initializeSearch();
    this.loadRelatedProducts();
  }

  async loadProducts() {
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
        this.products = data.products;
        return this.products;
      } else {
        console.error("No products data found");
        return [];
      }
    } catch (error) {
      console.error("Error loading products:", error);
      return [];
    }
  }

  initializeSearch() {
    if (this.products.length === 0) return;

    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");

    if (searchInput && searchResults) {
      searchInput.addEventListener("input", (e) => {
        this.performSearch(e.target.value, searchResults);
      });

      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          searchInput.value = "";
          searchResults.innerHTML = "";
          searchResults.style.display = "none";
        }
      });

      document.addEventListener("click", (e) => {
        const isSearchElement = searchInput.contains(e.target) || searchResults.contains(e.target);
        if (!isSearchElement) {
          searchResults.style.display = "none";
        }
      });
    }
  }

  performSearch(query, resultsContainer) {
    if (!query || query.length < 2) {
      resultsContainer.innerHTML = "";
      resultsContainer.style.display = "none";
      return;
    }

    const searchTerms = query.toLowerCase().trim().split(" ").filter(t => t.length > 1);

    const matchedProducts = this.products.filter(product => {
      const searchableText = [
        product.name,
        product.category,
        product.description,
        ...(product.tags || [])
      ].join(" ").toLowerCase();

      return searchTerms.every(term => searchableText.includes(term));
    });

    if (matchedProducts.length > 0) {
      resultsContainer.innerHTML = `
        <div class="search-results-wrapper">
          ${matchedProducts.slice(0, 8).map(product => `
            <div class="search-result-item">
              <h4><a href="product-detail.html?id=${product.id}">${this.highlightText(product.name, query)}</a></h4>
              <p>${this.highlightText(product.description.substring(0, 100) + "...", query)}</p>
              <span class="result-category">${product.category}</span>
            </div>
          `).join("")}
        </div>`;
      resultsContainer.style.display = "block";
    } else {
      resultsContainer.innerHTML = '<div class="no-results">No products found matching your search</div>';
      resultsContainer.style.display = "block";
    }
  }

  filterByCategory(category) {
    if (!this.products || this.products.length === 0) return;

    const filteredProducts = category === "all"
      ? this.products
      : this.products.filter(p => p.category === category);

    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");

    if (!searchInput || !searchResults) return;

    searchInput.value = category === "all" ? "" : category;

    if (filteredProducts.length > 0) {
      searchResults.innerHTML = `
        <div class="search-results-wrapper">
          <div style="padding:12px 20px;background:var(--light);border-bottom:1px solid var(--grey-light);display:flex;justify-content:space-between;align-items:center;">
            <strong style="font-size:0.85rem;">${filteredProducts.length} product${filteredProducts.length > 1 ? "s" : ""} in "${category}"</strong>
            <a href="#" onclick="clearSearch(); return false;" style="font-size:0.82rem;color:var(--accent);">Clear</a>
          </div>
          ${filteredProducts.map(product => `
            <div class="search-result-item">
              <h4><a href="product-detail.html?id=${product.id}">${product.name}</a></h4>
              <p>${product.description.substring(0, 100)}...</p>
              <span class="result-category">${product.category}</span>
            </div>
          `).join("")}
        </div>`;
      searchResults.style.display = "block";
    } else {
      searchResults.innerHTML = '<div class="no-results">No products found in this category</div>';
      searchResults.style.display = "block";
    }
  }

  highlightText(text, query) {
    if (!query) return text;
    const terms = query.trim().split(" ").filter(term => term.length > 1);
    let highlightedText = text;
    terms.forEach(term => {
      const regex = new RegExp(`(${this.escapeRegExp(term)})`, "gi");
      highlightedText = highlightedText.replace(regex, "<mark>$1</mark>");
    });
    return highlightedText;
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  loadRelatedProducts() {
    const relatedContainer = document.getElementById("related-products");
    if (!relatedContainer) return;
    if (this.products.length === 0) return;

    const urlParams = new URLSearchParams(window.location.search);
    const currentId = urlParams.get("id");
    if (!currentId) return;

    const currentProduct = this.products.find(p => p.id === currentId);
    if (!currentProduct) return;

    const relatedProducts = this.products
      .filter(p => p.id !== currentId)
      .map(p => {
        const matchingTags = (p.tags || []).filter(tag => (currentProduct.tags || []).includes(tag));
        const sameCategory = p.category === currentProduct.category ? 2 : 0;
        return { ...p, matchScore: matchingTags.length + sameCategory };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 4);

    if (relatedProducts.length > 0) {
      relatedContainer.innerHTML = `
        <div class="section-heading" style="text-align:left;">
          <p class="eyebrow">You May Also Like</p>
          <h2>Related Products</h2>
        </div>
        <div class="row g-3">
          ${relatedProducts.map(product => `
            <div class="col-lg-3 col-6">
              <div class="productCard">
                <a class="anchorAbs" href="product-detail.html?id=${product.id}"></a>
                <div class="hoverWrapper">
                  <img loading="lazy" class="mainImg" src="${product.images[0]}" alt="${product.name}">
                  <img loading="lazy" class="hoverImg" src="${product.images[1] || product.images[0]}" alt="${product.name}">
                </div>
                <div class="productInfo">
                  <h5>${product.name}</h5>
                  <span class="tag">${product.category}</span>
                </div>
              </div>
            </div>
          `).join("")}
        </div>`;
    }
  }

  getProductById(id) {
    return this.products.find(p => p.id === id);
  }

  getAllProducts() {
    return this.products;
  }

  getProductsByCategory(category) {
    return this.products.filter(p => p.category === category);
  }

  getCategories() {
    return [...new Set(this.products.map(p => p.category))];
  }
}

// Global instance
let productManager;

function clearSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  if (searchInput) searchInput.value = "";
  if (searchResults) {
    searchResults.innerHTML = "";
    searchResults.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  productManager = new ProductManager();
  await productManager.init();
});
