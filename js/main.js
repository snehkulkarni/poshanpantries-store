/* ================================================================
   PoshanPantries — shared website functionality
   No libraries are required. The cart is saved in localStorage.
   ================================================================ */

// Replace these two placeholders before accepting real orders.
const STORE_SETTINGS = {
  whatsappNumber: "919320291804", // Country code + number; no spaces or + sign.
  upiId: "yourname@upi",
  email: "hello@poshanpantries.in", // Replace with the real business email.
  phoneDisplay: "+91 99999 99999" // Replace with the real business phone number.
};

const CART_KEY = "poshanPantriesCart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0
  }).format(value);
}

function getProduct(id) {
  return PRODUCTS.find(product => product.id === Number(id));
}

function escapeHTML(value) {
  const element = document.createElement("div");
  element.textContent = value;
  return element.innerHTML;
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach(node => {
    node.textContent = count;
    node.setAttribute("aria-label", `${count} items in cart`);
  });
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2500);
}

function addToCart(productId, size, price, quantity = 1) {
  const product = getProduct(productId);
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(item => item.productId === product.id && item.size === size);
  if (existing) existing.quantity += Number(quantity);
  else cart.push({ productId: product.id, size, price: Number(price), quantity: Number(quantity) });
  saveCart(cart);
  showToast(`${product.name} added to your cart`);
}

function productCard(product, imageOverride = "") {
  const firstOption = product.options[0];
  const usesTemporaryPackage = typeof imageOverride === "string" && imageOverride;
  const cardImage = usesTemporaryPackage ? imageOverride : product.image;
  return `
    <article class="product-card">
      <a class="product-image-wrap" href="product.html?id=${product.id}" aria-label="View ${escapeHTML(product.name)}">
        <span class="product-badge">${escapeHTML(product.badge)}</span>
        ${usesTemporaryPackage ? '<span class="mockup-note">Temporary packaging</span>' : ''}
        <img src="${cardImage}" alt="${usesTemporaryPackage ? 'Temporary ivory pouch packaging mockup for ' : 'Placeholder illustration for '}${escapeHTML(product.name)}" loading="lazy">
      </a>
      <div class="product-info">
        <div class="product-category">${escapeHTML(product.category)}</div>
        <h3><a href="product.html?id=${product.id}">${escapeHTML(product.name)}</a></h3>
        <div class="product-price">From ${money(firstOption.price)}</div>
        <button class="button quick-add" type="button" data-id="${product.id}" data-size="${escapeHTML(firstOption.size)}" data-price="${firstOption.price}">Add ${escapeHTML(firstOption.size)}</button>
      </div>
    </article>`;
}

function bindQuickAdd(scope = document) {
  scope.querySelectorAll(".quick-add").forEach(button => {
    button.addEventListener("click", () => addToCart(button.dataset.id, button.dataset.size, button.dataset.price));
  });
}

function initialiseNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      nav.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    }));
  }

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach(link => {
    const href = link.getAttribute("href").split("?")[0];
    if (href === currentPage || (currentPage === "product.html" && href === "shop.html")) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

function initialiseUtilityBar() {
  document.querySelectorAll(".announcement").forEach(bar => {
    bar.innerHTML = `
      <div class="container utility-inner">
        <div class="utility-contact">
          <a href="mailto:${STORE_SETTINGS.email}" aria-label="Email PoshanPantries">✉ <span>${STORE_SETTINGS.email}</span></a>
          <a href="tel:${STORE_SETTINGS.phoneDisplay.replace(/[^+\d]/g, "")}" aria-label="Call PoshanPantries">☎ <span>${STORE_SETTINGS.phoneDisplay}</span></a>
        </div>
        <div class="utility-socials" aria-label="PoshanPantries social media">
          <span aria-label="Instagram" title="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" class="fill-dot"/></svg></span>
          <span aria-label="Facebook" title="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3 0-5 2-5 5v2H6v4h3v6h4v-6h3l1-4h-4V9c0-.7.3-1 1-1z" class="fill-icon"/></svg></span>
          <span aria-label="YouTube" title="YouTube"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 7.5c-.2-1.3-1.2-2.3-2.5-2.5C16.7 4.7 14.4 4.5 12 4.5S7.3 4.7 5.5 5C4.2 5.2 3.2 6.2 3 7.5c-.3 1.4-.5 2.9-.5 4.5s.2 3.1.5 4.5c.2 1.3 1.2 2.3 2.5 2.5 1.8.3 4.1.5 6.5.5s4.7-.2 6.5-.5c1.3-.2 2.3-1.2 2.5-2.5.3-1.4.5-2.9.5-4.5s-.2-3.1-.5-4.5z" class="fill-icon"/><path d="M10 9v6l5-3-5-3z" class="play-icon"/></svg></span>
        </div>
      </div>`;
  });
}

function initialiseWhatsAppLinks() {
  document.querySelectorAll("[data-whatsapp]").forEach(link => {
    const message = link.dataset.message || "Namaste PoshanPantries! I would like to know more about your products.";
    link.href = `https://wa.me/${STORE_SETTINGS.whatsappNumber}?text=${encodeURIComponent(message)}`;
    link.target = "_blank";
    link.rel = "noopener";
  });
  document.querySelectorAll("[data-upi-id]").forEach(node => node.textContent = STORE_SETTINGS.upiId);
}

function renderFeaturedProducts() {
  const grid = document.querySelector("[data-featured-products]");
  if (!grid) return;
  grid.innerHTML = PRODUCTS.filter(product => [1, 6, 9, 16].includes(product.id)).map(product => productCard(product, "images/package-mockup.png")).join("");
  bindQuickAdd(grid);
}

function initialiseShop() {
  const grid = document.querySelector("[data-shop-grid]");
  if (!grid) return;
  const search = document.querySelector("[data-product-search]");
  const chips = document.querySelectorAll("[data-filter]");
  const results = document.querySelector("[data-results-count]");
  const params = new URLSearchParams(window.location.search);
  let category = params.get("category") || "All";

  function render() {
    const query = search.value.trim().toLowerCase();
    const filtered = PRODUCTS.filter(product => {
      const matchesCategory = category === "All" || product.category === category;
      const matchesSearch = !query || `${product.name} ${product.category} ${product.short}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
    results.textContent = `${filtered.length} product${filtered.length === 1 ? "" : "s"} found`;
    grid.innerHTML = filtered.length ? filtered.map(productCard).join("") : `<div class="empty-state"><h3>No products found</h3><p>Try another search or category.</p></div>`;
    bindQuickAdd(grid);
  }

  chips.forEach(chip => {
    const isActive = chip.dataset.filter === category;
    chip.classList.toggle("active", isActive);
    chip.setAttribute("aria-pressed", String(isActive));
    chip.addEventListener("click", () => {
      category = chip.dataset.filter;
      chips.forEach(item => {
        const active = item === chip;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      render();
    });
  });
  search.addEventListener("input", render);
  render();
}

function initialiseProductPage() {
  const root = document.querySelector("[data-product-detail]");
  if (!root) return;
  const id = new URLSearchParams(window.location.search).get("id");
  const product = getProduct(id) || PRODUCTS[0];
  document.title = `${product.name} | PoshanPantries`;
  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) descriptionMeta.content = product.short;

  root.innerHTML = `
    <div class="product-gallery"><img src="${product.image}" alt="Placeholder illustration for ${escapeHTML(product.name)}"></div>
    <div class="product-copy">
      <div class="breadcrumbs"><a href="index.html">Home</a> / <a href="shop.html">Shop</a> / ${escapeHTML(product.name)}</div>
      <span class="eyebrow">${escapeHTML(product.category)}</span>
      <h1>${escapeHTML(product.name)}</h1>
      <div class="detail-price" data-detail-price>${money(product.options[0].price)}</div>
      <p class="detail-description">${escapeHTML(product.description)}</p>
      <ul class="detail-list">${product.benefits.map(benefit => `<li>${escapeHTML(benefit)}</li>`).join("")}</ul>
      <div class="purchase-box">
        <div class="option-row">
          <div class="field"><label for="pack-size">Choose pack size</label><select id="pack-size">${product.options.map(option => `<option value="${option.size}" data-price="${option.price}">${option.size} — ${money(option.price)}</option>`).join("")}</select></div>
          <div class="field"><label for="product-quantity">Quantity</label><div class="qty-control"><button type="button" data-detail-minus aria-label="Decrease quantity">−</button><input id="product-quantity" type="number" min="1" max="20" value="1"><button type="button" data-detail-plus aria-label="Increase quantity">+</button></div></div>
        </div>
        <div class="purchase-actions"><button class="button" type="button" data-detail-add>Add to cart</button><a class="button button--green" data-whatsapp data-message="Namaste! I am interested in ${escapeHTML(product.name)}. Please share more details.">Ask on WhatsApp</a></div>
      </div>
      <div class="detail-tabs">
        <details open><summary>Ingredients</summary><p>${escapeHTML(product.ingredients)}</p></details>
        <details><summary>How to use</summary><p>${escapeHTML(product.usage)}</p></details>
        <details><summary>Storage information</summary><p>${escapeHTML(product.storage)}</p></details>
        <details><summary>Shipping information</summary><p>Shipping cost and delivery time are confirmed on WhatsApp before payment.</p></details>
      </div>
    </div>`;

  const select = root.querySelector("#pack-size");
  const quantity = root.querySelector("#product-quantity");
  const price = root.querySelector("[data-detail-price]");
  function updatePrice() { price.textContent = money(Number(select.selectedOptions[0].dataset.price) * Number(quantity.value)); }
  root.querySelector("[data-detail-minus]").addEventListener("click", () => { quantity.value = Math.max(1, Number(quantity.value) - 1); updatePrice(); });
  root.querySelector("[data-detail-plus]").addEventListener("click", () => { quantity.value = Math.min(20, Number(quantity.value) + 1); updatePrice(); });
  select.addEventListener("change", updatePrice);
  quantity.addEventListener("change", () => { quantity.value = Math.max(1, Math.min(20, Number(quantity.value) || 1)); updatePrice(); });
  root.querySelector("[data-detail-add]").addEventListener("click", () => addToCart(product.id, select.value, select.selectedOptions[0].dataset.price, quantity.value));
  initialiseWhatsAppLinks();
  renderRelatedProducts(product);
}

function renderRelatedProducts(product) {
  const grid = document.querySelector("[data-related-products]");
  if (!grid) return;
  const related = PRODUCTS.filter(item => item.category === product.category && item.id !== product.id).slice(0, 4);
  grid.innerHTML = related.map(productCard).join("");
  bindQuickAdd(grid);
}

function initialiseCart() {
  const itemsRoot = document.querySelector("[data-cart-items]");
  if (!itemsRoot) return;

  function render() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (!cart.length) {
      itemsRoot.innerHTML = `<div class="empty-state"><h2>Your cart is empty</h2><p>Explore our pantry and add something nourishing.</p><a class="button" href="shop.html">Browse products</a></div>`;
    } else {
      itemsRoot.innerHTML = cart.map((item, index) => {
        const product = getProduct(item.productId);
        if (!product) return "";
        return `<article class="cart-item">
          <a href="product.html?id=${product.id}"><img src="${product.image}" alt="Placeholder illustration for ${escapeHTML(product.name)}"></a>
          <div><h3><a href="product.html?id=${product.id}">${escapeHTML(product.name)}</a></h3><div class="cart-item-meta">${escapeHTML(item.size)} · ${money(item.price)} each</div>
          <div class="cart-item-bottom"><div class="qty-control"><button type="button" data-cart-minus="${index}" aria-label="Decrease ${escapeHTML(product.name)} quantity">−</button><input type="number" value="${item.quantity}" min="1" max="20" data-cart-qty="${index}" aria-label="Quantity for ${escapeHTML(product.name)}"><button type="button" data-cart-plus="${index}" aria-label="Increase ${escapeHTML(product.name)} quantity">+</button></div><strong>${money(item.price * item.quantity)}</strong></div>
          <button class="remove-button" type="button" data-cart-remove="${index}">Remove item</button></div>
        </article>`;
      }).join("");
    }
    document.querySelector("[data-subtotal]").textContent = money(subtotal);
    document.querySelector("[data-total]").textContent = money(subtotal);
    const submit = document.querySelector("[data-checkout-submit]");
    if (submit) submit.disabled = cart.length === 0;
    bindCartControls();
  }

  function changeQuantity(index, quantity) {
    const cart = getCart();
    if (!cart[index]) return;
    cart[index].quantity = Math.max(1, Math.min(20, Number(quantity) || 1));
    saveCart(cart); render();
  }

  function bindCartControls() {
    itemsRoot.querySelectorAll("[data-cart-minus]").forEach(button => button.addEventListener("click", () => {
      const cart = getCart(); changeQuantity(button.dataset.cartMinus, cart[button.dataset.cartMinus].quantity - 1);
    }));
    itemsRoot.querySelectorAll("[data-cart-plus]").forEach(button => button.addEventListener("click", () => {
      const cart = getCart(); changeQuantity(button.dataset.cartPlus, cart[button.dataset.cartPlus].quantity + 1);
    }));
    itemsRoot.querySelectorAll("[data-cart-qty]").forEach(input => input.addEventListener("change", () => changeQuantity(input.dataset.cartQty, input.value)));
    itemsRoot.querySelectorAll("[data-cart-remove]").forEach(button => button.addEventListener("click", () => {
      const cart = getCart(); cart.splice(Number(button.dataset.cartRemove), 1); saveCart(cart); render(); showToast("Item removed from cart");
    }));
  }

  const form = document.querySelector("[data-checkout-form]");
  form.addEventListener("submit", event => {
    event.preventDefault();
    const cart = getCart();
    if (!cart.length) return;
    const data = new FormData(form);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const lines = cart.map((item, index) => {
      const product = getProduct(item.productId);
      return `${index + 1}. ${product.name} (${item.size}) × ${item.quantity} — ${money(item.price * item.quantity)}`;
    });
    const message = [
      "Namaste PoshanPantries! I would like to place this order:", "", ...lines, "",
      `Total: ${money(total)}`, "",
      `Name: ${data.get("name")}`, `Phone: ${data.get("phone")}`, `Address: ${data.get("address")}`,
      data.get("notes") ? `Notes: ${data.get("notes")}` : "", "", "Please confirm availability, shipping and payment details."
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${STORE_SETTINGS.whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  });
  render();
}

function initialiseContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(form);
    const message = `Namaste PoshanPantries!\n\nName: ${data.get("name")}\nPhone: ${data.get("phone")}\nMessage: ${data.get("message")}`;
    window.open(`https://wa.me/${STORE_SETTINGS.whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initialiseUtilityBar();
  initialiseNavigation();
  initialiseWhatsAppLinks();
  updateCartCount();
  renderFeaturedProducts();
  initialiseShop();
  initialiseProductPage();
  initialiseCart();
  initialiseContactForm();
  document.querySelectorAll("[data-year]").forEach(node => node.textContent = new Date().getFullYear());
});

