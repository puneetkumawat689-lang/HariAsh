/**
 * Hari Ash Natural Organics - Complete Unified Script
 */

// 1. Global State
let cart = [];
let wishlistCount = 0;
let toastTimeout = null;
const WHATSAPP_NUMBER = "918952919243";

// 2. DOM Elements
const cartOverlay = document.getElementById('cartOverlay');
const cartDrawer = document.getElementById('cartDrawer') || document.getElementById('cartSidebar');
const cartBtn = document.getElementById('cartBtn') || document.getElementById('openCartBtn');
const cartCountBadges = document.querySelectorAll('.cart-count, #cartCountBadge');
const wishlistBadge = document.querySelector('#wishlistBtn .badge');
const toast = document.getElementById('toast');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterTabs = document.querySelectorAll('.filter-tab');
const productCards = document.querySelectorAll('.product-card');

/* ==========================================
   3. CART DRAWER (OPEN / CLOSE ANIMATION)
   ========================================== */

function toggleCartDrawer(open) {
  if (!cartDrawer || !cartOverlay) return;

  if (open) {
    cartOverlay.classList.remove('hidden');
    requestAnimationFrame(() => {
      cartOverlay.classList.remove('opacity-0');
      cartOverlay.classList.add('opacity-100');
      cartDrawer.classList.remove('translate-x-full');
      cartDrawer.classList.add('translate-x-0');
    });
    document.body.classList.add('overflow-hidden');
  } else {
    cartDrawer.classList.remove('translate-x-0');
    cartDrawer.classList.add('translate-x-full');
    cartOverlay.classList.remove('opacity-100');
    cartOverlay.classList.add('opacity-0');

    setTimeout(() => {
      cartOverlay.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }, 300);
  }
}

function openCart() {
  toggleCartDrawer(true);
}

function closeCart() {
  toggleCartDrawer(false);
}

if (cartBtn) {
  cartBtn.addEventListener('click', openCart);
}

/* ==========================================
   4. DYNAMIC WEIGHT & PRICE SELECTOR
   ========================================== */

function initWeightSelectors() {
  document.querySelectorAll('.product-card').forEach((card) => {
    const weightButtons = card.querySelectorAll('.weight-btn');
    const priceDisplay = card.querySelector('.product-price .price');
    const unitDisplay = card.querySelector('.product-price .unit');

    weightButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Toggle Active Styling
        weightButtons.forEach((b) => {
          b.className = 'weight-btn px-2.5 py-1 text-[11px] font-medium border border-gray-200 text-gray-600 rounded-md hover:border-gray-400 transition';
          b.classList.remove('active');
        });
        btn.className = 'weight-btn active px-2.5 py-1 text-[11px] font-medium border border-emerald-600 bg-emerald-50 text-emerald-700 rounded-md transition';

        // Price & Unit Text Update
        const newPrice = btn.getAttribute('data-price');
        const newUnit = btn.getAttribute('data-unit') || `/ ${btn.textContent.trim()}`;

        if (priceDisplay && newPrice) {
          priceDisplay.textContent = `₹ ${newPrice}`;
        }
        if (unitDisplay && newUnit) {
          unitDisplay.textContent = newUnit;
        }
      });
    });
  });
}

/* ==========================================
   5. CART MANAGEMENT LOGIC
   ========================================== */

function addToCart(btnElement, name, directPrice, directWeight) {
  const card = btnElement ? btnElement.closest('.product-card') : null;
  const activeWeightBtn = card ? card.querySelector('.weight-btn.active') : null;

  // Resolve Weight & Price
  const weight = directWeight || (activeWeightBtn ? activeWeightBtn.textContent.trim() : 'Standard');
  let price = directPrice !== undefined ? Number(directPrice) : 0;

  if (!price) {
    if (activeWeightBtn && activeWeightBtn.getAttribute('data-price')) {
      price = parseFloat(activeWeightBtn.getAttribute('data-price'));
    } else if (card) {
      const priceText = card.querySelector('.product-price .price')?.textContent || '0';
      price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
    }
  }

  const existingItem = cart.find((item) => item.name === name && item.weight === weight);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      id: `${name}-${weight}`,
      name: name,
      weight: weight,
      price: price,
      qty: 1
    });
  }

  updateCartUI();
  toggleCartDrawer(true);
  showToast(`Added ${name} (${weight}) to cart!`);
}

function updateQuantity(id, delta) {
  const itemIndex = cart.findIndex((item) => item.id === id);
  if (itemIndex > -1) {
    cart[itemIndex].qty += delta;
    if (cart[itemIndex].qty <= 0) {
      cart.splice(itemIndex, 1);
    }
  }
  updateCartUI();
}

function updateCartUI() {
  const totalCount = cart.reduce((acc, curr) => acc + curr.qty, 0);
  const totalPrice = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);

  // 1. Update Badges
  cartCountBadges.forEach((badge) => {
    badge.textContent = totalCount;
  });

  // 2. Update Total Prices (Supports both Drawer styles)
  const cartTotal = document.getElementById('cartTotal');
  const subtotalElem = document.getElementById('subtotalPrice');
  const totalElem = document.getElementById('finalTotalPrice');

  if (cartTotal) cartTotal.textContent = `₹ ${totalPrice}`;
  if (subtotalElem) subtotalElem.textContent = `₹ ${totalPrice}`;
  if (totalElem) totalElem.textContent = `₹ ${totalPrice}`;

  // 3. Render Items
  const container = document.getElementById('cartItemsContainer') || document.getElementById('cartItems');
  const emptyState = document.getElementById('emptyCartState') || document.getElementById('cartEmpty');
  const cartFooter = document.getElementById('cartFooter');

  if (!container) return;

  if (cart.length === 0) {
    if (emptyState) emptyState.classList.remove('hidden');
    if (cartFooter) cartFooter.style.display = 'none';
    container.innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-shopping-cart text-gray-300 text-5xl mb-3"></i>
        <p class="text-gray-500 font-medium text-sm">Your cart is empty.</p>
        <span class="text-xs text-gray-400">Add fresh products to proceed.</span>
      </div>`;
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  if (cartFooter) cartFooter.style.display = 'block';

  container.innerHTML = cart
    .map(
      (item) => `
      <div class="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
        <div class="min-w-0 pr-3">
          <h5 class="text-xs font-bold text-gray-900 truncate">${item.name}</h5>
          <span class="text-[11px] text-gray-500 font-medium">Pack: ${item.weight} | ₹${item.price} each</span>
          <p class="text-xs font-extrabold text-emerald-700 mt-0.5">₹ ${item.price * item.qty}</p>
        </div>

        <div class="flex items-center gap-2 border border-gray-200 rounded-lg px-2 py-1 bg-white shadow-sm shrink-0">
          <button type="button" onclick="updateQuantity('${item.id}', -1)" class="text-gray-500 hover:text-red-500 text-xs px-1 font-bold">−</button>
          <span class="text-xs font-bold text-gray-900 w-4 text-center">${item.qty}</span>
          <button type="button" onclick="updateQuantity('${item.id}', 1)" class="text-gray-500 hover:text-emerald-600 text-xs px-1 font-bold">+</button>
        </div>
      </div>`
    )
    .join('');
}

/* ==========================================
   6. WHATSAPP ORDER CHECKOUT
   ========================================== */

function checkoutToWhatsApp() {
  if (cart.length === 0) {
    alert("Please add at least one product to your cart.");
    return;
  }

  const nameInput = document.getElementById("custName") || document.getElementById("nameInput");
  const addressInput = document.getElementById("custAddress") || document.getElementById("messageInput");
  const payMethodInput = document.querySelector('input[name="payMethod"]:checked');

  const name = nameInput ? nameInput.value.trim() : "";
  const address = addressInput ? addressInput.value.trim() : "";
  const paymentMethod = payMethodInput ? payMethodInput.value : "Cash on Delivery";

  if (!name || !address) {
    alert("Please enter your Name and Delivery Address.");
    return;
  }

  let totalAmount = 0;
  let itemsSummary = "";

  cart.forEach((item, idx) => {
    const lineTotal = item.price * item.qty;
    totalAmount += lineTotal;
    itemsSummary += `${idx + 1}. *${item.name}* (${item.weight})\n   Qty: ${item.qty} | Price: ₹${lineTotal}\n`;
  });

  const message = 
`*NEW ORDER INQUIRY - HARI ASH NATURAL* 🛒
--------------------------------------
👤 *Customer Name:* ${name}
📍 *Delivery Address:* ${address}
💳 *Payment Mode:* ${paymentMethod}
--------------------------------------
*ORDERED ITEMS:*
${itemsSummary}
--------------------------------------
💰 *TOTAL AMOUNT:* ₹${totalAmount}
🚚 *Delivery:* Daily Supply / Free Delivery
--------------------------------------
_Please confirm availability and dispatch time._`;

  const encodedMsg = encodeURIComponent(message);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`, "_blank");
}

/* ==========================================
   7. TOAST NOTIFICATIONS
   ========================================== */

function showToast(message) {
  if (!toast) return;

  clearTimeout(toastTimeout);
  toast.textContent = message;

  toast.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-2');
  toast.classList.add('opacity-100', 'translate-y-0');

  toastTimeout = setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', '-translate-y-2', 'pointer-events-none');
  }, 2400);
}

/* ==========================================
   8. WISHLIST TOGGLE
   ========================================== */

function addWishlist(btn) {
  const icon = btn.querySelector('i');
  if (icon) {
    if (icon.classList.contains('far')) {
      icon.classList.remove('far', 'text-gray-500');
      icon.classList.add('fas', 'text-rose-500');
      wishlistCount++;
      showToast('Added to wishlist!');
    } else {
      icon.classList.remove('fas', 'text-rose-500');
      icon.classList.add('far', 'text-gray-500');
      wishlistCount = Math.max(0, wishlistCount - 1);
      showToast('Removed from wishlist');
    }
    if (wishlistBadge) wishlistBadge.textContent = wishlistCount;
  }
}

/* ==========================================
   9. CATEGORY FILTER TABS
   ========================================== */

filterTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    filterTabs.forEach((t) => {
      t.className = 'filter-tab px-5 py-2 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition';
    });

    tab.className = 'filter-tab active px-5 py-2 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-sm';

    const filter = (tab.dataset.filter || 'all').toLowerCase();

    productCards.forEach((card) => {
      const category = (card.dataset.category || '').toLowerCase();
      if (filter === 'all' || category.includes(filter)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ==========================================
   10. PRODUCT SEARCH
   ========================================== */

function handleProductSearch() {
  if (!searchInput) return;
  const term = searchInput.value.toLowerCase().trim();

  productCards.forEach((card) => {
    const title = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
    const desc = card.querySelector('.product-desc')?.textContent.toLowerCase() || '';

    if (title.includes(term) || desc.includes(term)) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

if (searchInput) {
  searchInput.addEventListener('input', handleProductSearch);
}
if (searchBtn) {
  searchBtn.addEventListener('click', handleProductSearch);
}

/* ==========================================
   11. MOBILE NAVIGATION DRAWER
   ========================================== */

if (mobileMenuBtn && mainNav) {
  mobileMenuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('hidden');
  });
}

/* ==========================================
   12. GLOBAL SCOPE ATTACHMENTS & INIT
   ========================================== */

window.openCart = openCart;
window.closeCart = closeCart;
window.toggleCartDrawer = toggleCartDrawer;
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.updateCartQty = updateQuantity; // Compatibility alias
window.addWishlist = addWishlist;
window.checkoutToWhatsApp = checkoutToWhatsApp;

document.addEventListener('DOMContentLoaded', () => {
  initWeightSelectors();
  updateCartUI();
});