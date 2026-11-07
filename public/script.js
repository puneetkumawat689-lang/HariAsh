/**
 * Hari Ash Natural Organics - Complete Script
 * With Full Motion / Animation System
 */

// Global State
let cart = [];
let wishlistCount = 0;
let toastTimeout = null;

// DOM Elements
const cartOverlay = document.getElementById('cartOverlay');
const cartSidebar = document.getElementById('cartSidebar');
const cartBtn = document.getElementById('cartBtn');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartFooter = document.getElementById('cartFooter');
const cartTotal = document.getElementById('cartTotal');
const cartCountBadges = document.querySelectorAll('.cart-count');
const wishlistBadge = document.querySelector('#wishlistBtn .badge');
const toast = document.getElementById('toast');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterTabs = document.querySelectorAll('.filter-tab');
const productCards = document.querySelectorAll('.product-card');

/* ==========================================
   MOTION SYSTEM — CSS Injection
   ========================================== */

const motionStyles = document.createElement('style');
motionStyles.textContent = `
  /* ---- Base reveal states ---- */
  .reveal {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1);
  }
  .reveal.reveal-left {
    transform: translateX(-50px);
  }
  .reveal.reveal-right {
    transform: translateX(50px);
  }
  .reveal.reveal-scale {
    transform: scale(0.85);
  }
  .reveal.reveal-up {
    transform: translateY(40px);
  }
  .reveal.visible {
    opacity: 1;
    transform: none;
  }

  /* ---- Stagger children ---- */
  .stagger-children > * {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s cubic-bezier(.22,1,.36,1), transform 0.6s cubic-bezier(.22,1,.36,1);
  }
  .stagger-children.visible > * {
    opacity: 1;
    transform: none;
  }
  .stagger-children.visible > *:nth-child(1) { transition-delay: 0s; }
  .stagger-children.visible > *:nth-child(2) { transition-delay: 0.08s; }
  .stagger-children.visible > *:nth-child(3) { transition-delay: 0.16s; }
  .stagger-children.visible > *:nth-child(4) { transition-delay: 0.24s; }
  .stagger-children.visible > *:nth-child(5) { transition-delay: 0.32s; }
  .stagger-children.visible > *:nth-child(6) { transition-delay: 0.40s; }
  .stagger-children.visible > *:nth-child(7) { transition-delay: 0.48s; }
  .stagger-children.visible > *:nth-child(8) { transition-delay: 0.56s; }

  /* ---- Hero image float ---- */
  @keyframes floatY {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-18px); }
  }
  #heroImg { animation: floatY 4s ease-in-out infinite; }

  /* ---- Pulse glow on hero badges ---- */
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(22,163,74,0.3); }
    50%       { box-shadow: 0 0 0 10px rgba(22,163,74,0); }
  }
  #hero .absolute { animation: glowPulse 3s ease-in-out infinite; }

  /* ---- Announcement bar ticker ---- */
  @keyframes ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .ticker-track { animation: ticker 22s linear infinite; }
  .ticker-track:hover { animation-play-state: paused; }

  /* ---- Logo spin on hover ---- */
  header .group:hover .logo-icon { transform: rotate(10deg) scale(1.08); }
  .logo-icon { transition: transform 0.35s cubic-bezier(.22,1,.36,1); }

  /* ---- Category card hover lift ---- */
  #categories .group {
    transition: transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease;
  }
  #categories .group:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 24px 48px rgba(0,0,0,0.18);
  }

  /* ---- Product card hover lift ---- */
  .product-card {
    transition: transform 0.35s cubic-bezier(.22,1,.36,1),
                box-shadow 0.35s ease,
                opacity 0.25s ease;
  }
  .product-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.12);
  }

  /* ---- Add-to-cart button pop ---- */
  @keyframes btnPop {
    0%   { transform: scale(1); }
    40%  { transform: scale(0.88); }
    80%  { transform: scale(1.12); }
    100% { transform: scale(1); }
  }
  .add-cart-btn.popping { animation: btnPop 0.35s ease forwards; }

  /* ---- badge bounce on add ---- */
  @keyframes badgeBounce {
    0%,100% { transform: scale(1); }
    40%     { transform: scale(1.5); }
    70%     { transform: scale(0.9); }
  }
  .badge.bounce { animation: badgeBounce 0.4s ease; }

  /* ---- Whatsapp float pulse ---- */
  @keyframes waPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(52,211,153,0.5); }
    70%      { box-shadow: 0 0 0 14px rgba(52,211,153,0); }
  }
  #waFloat { animation: waPulse 2.2s ease-in-out infinite; }

  /* ---- Feature strip slide-in ---- */
  #features .reveal { transform: translateY(24px); }

  /* ---- Organic section text scramble reveal ---- */
  #organic h2 span {
    display: inline-block;
    transition: transform 0.6s cubic-bezier(.22,1,.36,1), opacity 0.6s ease;
  }

  /* ---- Testimonial card tilt ---- */
  .testimonial-card {
    transition: transform 0.4s ease, box-shadow 0.4s ease;
  }
  .testimonial-card:hover {
    transform: rotate(-1deg) translateY(-4px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.1);
  }

  /* ---- Section heading underline draw ---- */
  .section-heading::after {
    content: '';
    display: block;
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, #16a34a, #d97706);
    border-radius: 999px;
    margin: 8px auto 0;
    transition: width 0.8s cubic-bezier(.22,1,.36,1);
  }
  .section-heading.visible::after { width: 60px; }

  /* ---- Sticky header hide/show on scroll ---- */
  #header {
    transition: transform 0.4s cubic-bezier(.22,1,.36,1),
                box-shadow 0.3s ease,
                background 0.3s ease;
  }
  #header.hidden-header { transform: translateY(-110%); }
  #header.scrolled { box-shadow: 0 4px 24px rgba(0,0,0,0.08); }

  /* ---- Page progress bar ---- */
  #scrollProgress {
    position: fixed;
    top: 0; left: 0;
    height: 3px;
    width: 0%;
    background: linear-gradient(90deg, #16a34a, #f59e0b);
    z-index: 9999;
    transition: width 0.1s linear;
    border-radius: 0 2px 2px 0;
  }

  /* ---- Counter number roll ---- */
  .count-up { display: inline-block; }

  /* ---- Loading skeleton shimmer on images ---- */
  img { transition: opacity 0.5s ease; }
  img.loaded { opacity: 1; }
`;
document.head.appendChild(motionStyles);

/* ==========================================
   SCROLL PROGRESS BAR
   ========================================== */

const progressBar = document.createElement('div');
progressBar.id = 'scrollProgress';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${(scrollTop / docHeight) * 100}%`;
}, { passive: true });

/* ==========================================
   STICKY HEADER — HIDE ON SCROLL DOWN
   ========================================== */

let lastScrollY = 0;
const header = document.getElementById('header');
const topBar = document.getElementById('topBar');

window.addEventListener('scroll', () => {
  const currentY = window.scrollY;

  if (header) {
    if (currentY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (currentY > lastScrollY && currentY > 200) {
      header.classList.add('hidden-header');
    } else {
      header.classList.remove('hidden-header');
    }
  }

  lastScrollY = currentY;
}, { passive: true });

/* ==========================================
   ANNOUNCEMENT BAR — TICKER
   ========================================== */

if (topBar) {
  const inner = topBar.querySelector('div');
  if (inner) {
    const clone = inner.cloneNode(true);
    const track = document.createElement('div');
    track.className = 'ticker-track flex items-center gap-x-8 whitespace-nowrap w-max';
    track.append(inner.cloneNode(true), clone);
    topBar.innerHTML = '';
    topBar.style.overflow = 'hidden';
    topBar.appendChild(track);
  }
}

/* ==========================================
   INTERSECTION OBSERVER — REVEAL ANIMATIONS
   ========================================== */

function initRevealAnimations() {
  // Add reveal classes to sections
  const animateTargets = [
    { selector: '#hero .lg\\:col-span-7', cls: 'reveal reveal-left' },
    { selector: '#hero .lg\\:col-span-5', cls: 'reveal reveal-right' },
    { selector: '#features .grid', cls: 'stagger-children' },
    { selector: '#categories .grid', cls: 'stagger-children' },
    { selector: '#products .text-center', cls: 'reveal reveal-up' },
    { selector: '#products #filterTabs', cls: 'reveal reveal-up' },
    { selector: '#products .grid', cls: 'stagger-children' },
    { selector: '#organic .lg\\:col-span-6:first-child', cls: 'reveal reveal-left' },
    { selector: '#organic .lg\\:col-span-6:last-child', cls: 'reveal reveal-right' },
    { selector: '#bulk .text-center', cls: 'reveal reveal-up' },
    { selector: '#bulk .grid', cls: 'stagger-children' },
    { selector: '#about .grid', cls: 'stagger-children' },
    { selector: '#contact .lg\\:col-span-6:first-child', cls: 'reveal reveal-left' },
    { selector: '#contact .lg\\:col-span-6:last-child', cls: 'reveal reveal-right' },
  ];

  animateTargets.forEach(({ selector, cls }) => {
    const el = document.querySelector(selector);
    if (el) {
      cls.split(' ').forEach(c => el.classList.add(c));
    }
  });

  // Add section headings class
  document.querySelectorAll('h2').forEach(h => {
    if (!h.closest('header') && !h.closest('footer')) {
      h.classList.add('section-heading');
    }
  });

  // Add testimonial card class
  document.querySelectorAll('#contact ~ section .bg-white, section.py-16.bg-gray-50 .bg-white').forEach(el => {
    el.classList.add('testimonial-card');
  });

  // Observer for reveal
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .stagger-children, .section-heading').forEach(el => {
    revealObs.observe(el);
  });
}

/* ==========================================
   COUNTER ANIMATION (Stats / Numbers)
   ========================================== */

function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const counterData = [
    { text: '500+', value: 500, label: 'Happy Clients' },
    { text: '10+', value: 10, label: 'Years Experience' },
    { text: '50kg', value: 50, label: 'Max Bulk Order' },
  ];

  const statsSection = document.createElement('section');
  statsSection.className = 'py-10 bg-gradient-to-r from-brand-700 to-brand-600 text-white';
  statsSection.id = 'stats';
  statsSection.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-3 gap-6 text-center stagger-children">
        <div>
          <div class="text-4xl font-extrabold font-serif" data-count="500" data-suffix="+">0</div>
          <div class="text-xs text-brand-200 mt-1 font-medium uppercase tracking-widest">Happy Clients</div>
        </div>
        <div>
          <div class="text-4xl font-extrabold font-serif" data-count="5" data-suffix="+">0</div>
          <div class="text-xs text-brand-200 mt-1 font-medium uppercase tracking-widest">Years of Trust</div>
        </div>
        <div>
          <div class="text-4xl font-extrabold font-serif" data-count="50" data-suffix="kg+">0</div>
          <div class="text-xs text-brand-200 mt-1 font-medium uppercase tracking-widest">Bulk Orders/Day</div>
        </div>
      </div>
    </div>`;

  const featuresSection = document.getElementById('features');
  if (featuresSection) {
    featuresSection.insertAdjacentElement('afterend', statsSection);
  }

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-count]').forEach(el => {
          const target = parseInt(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          animateCounter({ textContent: '', set textContent(v) { el.textContent = v + suffix; } }, target, 1800);
        });
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counterObs.observe(statsSection);
}

/* ==========================================
   LOGO ICON CLASS
   ========================================== */

function initLogoAnimation() {
  const logoIcon = document.querySelector('header a .rounded-2xl');
  if (logoIcon) logoIcon.classList.add('logo-icon');
}

/* ==========================================
   IMAGE LAZY-LOAD WITH FADE
   ========================================== */

function initImageFade() {
  document.querySelectorAll('img').forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.style.opacity = '0';
      img.addEventListener('load', () => {
        img.style.opacity = '1';
      });
    }
  });
}

/* ==========================================
   PRODUCT FILTER — ANIMATED HIDE/SHOW
   ========================================== */

function animatedFilter(filter) {
  productCards.forEach((card, i) => {
    const category = (card.dataset.category || '').toLowerCase();
    const matches = filter === 'all' || category.includes(filter);

    if (matches) {
      card.style.display = '';
      card.style.opacity = '0';
      card.style.transform = 'scale(0.92) translateY(16px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(.22,1,.36,1)';
        card.style.opacity = '1';
        card.style.transform = '';
      }, i * 45);
    } else {
      card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      card.style.opacity = '0';
      card.style.transform = 'scale(0.9)';
      setTimeout(() => { card.style.display = 'none'; }, 260);
    }
  });
}

/* ==========================================
   1. CART DRAWER (OPEN / CLOSE ANIMATION)
   ========================================== */

function openCart() {
  if (!cartSidebar || !cartOverlay) return;
  cartOverlay.classList.remove('hidden');
  requestAnimationFrame(() => {
    cartOverlay.classList.remove('opacity-0');
    cartOverlay.classList.add('opacity-100');
    cartSidebar.classList.remove('translate-x-full');
    cartSidebar.classList.add('translate-x-0');
  });
  document.body.classList.add('overflow-hidden');
}

function closeCart() {
  if (!cartSidebar || !cartOverlay) return;
  cartSidebar.classList.remove('translate-x-0');
  cartSidebar.classList.add('translate-x-full');
  cartOverlay.classList.remove('opacity-100');
  cartOverlay.classList.add('opacity-0');

  setTimeout(() => {
    cartOverlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }, 300);
}

if (cartBtn) {
  cartBtn.addEventListener('click', openCart);
}

/* ==========================================
   2. DYNAMIC WEIGHT & PRICE SELECTOR
   ========================================== */

function initWeightSelectors() {
  document.querySelectorAll('.product-card').forEach((card) => {
    const weightButtons = card.querySelectorAll('.weight-btn');
    const priceDisplay = card.querySelector('.product-price .price');
    const unitDisplay = card.querySelector('.product-price .unit');

    weightButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        weightButtons.forEach((b) => {
          b.className = 'weight-btn px-2.5 py-1 text-[11px] font-medium border border-gray-200 text-gray-600 rounded-md hover:border-gray-400';
          b.classList.remove('active');
        });
        btn.className = 'weight-btn active px-2.5 py-1 text-[11px] font-medium border border-brand-600 bg-brand-50 text-brand-700 rounded-md';

        const newPrice = btn.getAttribute('data-price');
        const newUnit = btn.getAttribute('data-unit') || `/ ${btn.textContent.trim()}`;

        if (priceDisplay && newPrice) priceDisplay.textContent = `₹ ${newPrice}`;
        if (unitDisplay && newUnit) unitDisplay.textContent = newUnit;
      });
    });
  });
}

/* ==========================================
   3. CART MANAGEMENT & WHATSAPP CHECKOUT
   ========================================== */

function addToCart(btnElement, name) {
  // Button pop animation
  btnElement.classList.add('popping');
  setTimeout(() => btnElement.classList.remove('popping'), 380);

  // Badge bounce
  cartCountBadges.forEach(badge => {
    badge.classList.add('bounce');
    setTimeout(() => badge.classList.remove('bounce'), 420);
  });

  const card = btnElement.closest('.product-card');
  const activeWeightBtn = card ? card.querySelector('.weight-btn.active') : null;

  const weight = activeWeightBtn ? activeWeightBtn.textContent.trim() : 'Standard';
  let price = 0;

  if (activeWeightBtn && activeWeightBtn.getAttribute('data-price')) {
    price = parseFloat(activeWeightBtn.getAttribute('data-price'));
  } else if (card) {
    const priceText = card.querySelector('.product-price .price')?.textContent || '0';
    price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
  }

  const existingItem = cart.find((item) => item.name === name && item.weight === weight);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ id: `${name}-${weight}`, name, weight, price, qty: 1 });
  }

  updateCartUI();
  showToast(`🛒 ${name} (${weight}) added!`);
}

function updateQuantity(id, delta) {
  const itemIndex = cart.findIndex((item) => item.id === id);
  if (itemIndex > -1) {
    cart[itemIndex].qty += delta;
    if (cart[itemIndex].qty <= 0) cart.splice(itemIndex, 1);
  }
  updateCartUI();
}

function updateCartUI() {
  const totalCount = cart.reduce((acc, curr) => acc + curr.qty, 0);
  const totalPrice = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);

  cartCountBadges.forEach((badge) => { badge.textContent = totalCount; });
  if (cartTotal) cartTotal.textContent = `₹${totalPrice}`;

  if (cart.length === 0) {
    if (cartEmpty) cartEmpty.classList.remove('hidden');
    if (cartFooter) cartFooter.style.display = 'none';
    if (cartItems) cartItems.innerHTML = '';
  } else {
    if (cartEmpty) cartEmpty.classList.add('hidden');
    if (cartFooter) cartFooter.style.display = 'block';

    if (cartItems) {
      cartItems.innerHTML = cart.map((item) => `
        <li class="py-3 flex items-center justify-between gap-3 border-b border-gray-100 last:border-b-0">
          <div class="flex-1 min-w-0">
            <h5 class="text-xs font-bold text-gray-900 truncate">${item.name}</h5>
            <span class="text-[11px] text-gray-500">${item.weight} • ₹${item.price} each</span>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="updateQuantity('${item.id}', -1)" class="w-6 h-6 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold transition">-</button>
            <span class="text-xs font-bold text-gray-900 w-4 text-center">${item.qty}</span>
            <button onclick="updateQuantity('${item.id}', 1)" class="w-6 h-6 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold transition">+</button>
          </div>
        </li>`).join('');
    }

    const checkoutBtn = document.querySelector('.whatsapp-order-btn');
    if (checkoutBtn) {
      let waMsg = `*New Order - Hari Ash Natural Organics*%0A------------------------------%0A`;
      cart.forEach((item, index) => {
        waMsg += `${index + 1}. *${item.name}* (${item.weight}) x ${item.qty} = ₹${item.price * item.qty}%0A`;
      });
      waMsg += `------------------------------%0A*Total Bill:* ₹${totalPrice}%0A%0APlease confirm my order!`;
      checkoutBtn.href = `https://wa.me/918952919243?text=${waMsg}`;
    }
  }
}

/* ==========================================
   4. TOAST NOTIFICATIONS
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
   5. WISHLIST TOGGLE
   ========================================== */

function addWishlist(btn) {
  const icon = btn.querySelector('i');
  if (icon) {
    if (icon.classList.contains('far')) {
      icon.classList.replace('far', 'fas');
      icon.classList.add('text-rose-500');
      icon.classList.remove('text-gray-500');
      wishlistCount++;
      // Heart pop
      btn.style.transform = 'scale(1.4)';
      setTimeout(() => { btn.style.transform = ''; }, 200);
      showToast('❤️ Added to wishlist!');
    } else {
      icon.classList.replace('fas', 'far');
      icon.classList.remove('text-rose-500');
      icon.classList.add('text-gray-500');
      wishlistCount = Math.max(0, wishlistCount - 1);
      showToast('Removed from wishlist');
    }
    if (wishlistBadge) wishlistBadge.textContent = wishlistCount;
  }
}

/* ==========================================
   6. CATEGORY FILTER TABS (ANIMATED)
   ========================================== */

filterTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    filterTabs.forEach((t) => {
      t.className = 'filter-tab px-5 py-2 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-brand-50 hover:text-brand-600 transition';
    });
    tab.className = 'filter-tab active px-5 py-2 rounded-full text-xs font-semibold bg-brand-600 text-white shadow-sm';

    const filter = (tab.dataset.filter || 'all').toLowerCase();
    animatedFilter(filter);
  });
});

/* ==========================================
   7. PRODUCT SEARCH (ANIMATED)
   ========================================== */

function handleProductSearch() {
  if (!searchInput) return;
  const term = searchInput.value.toLowerCase().trim();

  productCards.forEach((card, i) => {
    const title = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
    const desc = card.querySelector('.product-desc')?.textContent.toLowerCase() || '';
    const matches = title.includes(term) || desc.includes(term);

    if (matches) {
      card.style.display = '';
      setTimeout(() => {
        card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        card.style.opacity = '1';
        card.style.transform = '';
      }, i * 40);
    } else {
      card.style.transition = 'opacity 0.2s ease';
      card.style.opacity = '0';
      setTimeout(() => { card.style.display = 'none'; }, 220);
    }
  });
}

if (searchInput) searchInput.addEventListener('input', handleProductSearch);
if (searchBtn) searchBtn.addEventListener('click', handleProductSearch);

/* ==========================================
   8. MOBILE NAVIGATION DRAWER
   ========================================== */

if (mobileMenuBtn && mainNav) {
  mobileMenuBtn.addEventListener('click', () => {
    const isHidden = mainNav.classList.contains('hidden');
    if (isHidden) {
      mainNav.classList.remove('hidden');
      mainNav.style.maxHeight = '0';
      mainNav.style.overflow = 'hidden';
      mainNav.style.transition = 'max-height 0.35s cubic-bezier(.22,1,.36,1)';
      requestAnimationFrame(() => { mainNav.style.maxHeight = '200px'; });
    } else {
      mainNav.style.maxHeight = '0';
      setTimeout(() => { mainNav.classList.add('hidden'); }, 360);
    }
  });
}

/* ==========================================
   9. ENQUIRY FORM / WHATSAPP SUBMIT
   ========================================== */

function submitEnquiry(event) {
  event.preventDefault();
  const submitBtn = document.getElementById('submitBtn');

  // Button loading state
  if (submitBtn) {
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
  }

  const name = document.getElementById('nameInput')?.value.trim();
  const phone = document.getElementById('phoneInput')?.value.trim();
  const product = document.getElementById('productInput')?.value;
  const message = document.getElementById('messageInput')?.value.trim();

  if (!name || !phone) {
    showToast('⚠️ Please enter your name and phone number');
    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fab fa-whatsapp text-lg"></i> Send via WhatsApp';
      submitBtn.disabled = false;
    }
    return;
  }

  setTimeout(() => {
    let text = `*New Order / Enquiry - Hari Ash Organics*%0A`;
    text += `*Name:* ${encodeURIComponent(name)}%0A`;
    text += `*Phone:* ${encodeURIComponent(phone)}%0A`;
    if (product) text += `*Product:* ${encodeURIComponent(product)}%0A`;
    if (message) text += `*Message:* ${encodeURIComponent(message)}`;

    window.open(`https://wa.me/918952919243?text=${text}`, '_blank');

    if (submitBtn) {
      submitBtn.innerHTML = '✅ Sent! Redirecting...';
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fab fa-whatsapp text-lg"></i> Send via WhatsApp';
        submitBtn.disabled = false;
      }, 2500);
    }
  }, 600);
}

/* ==========================================
   SMOOTH ACTIVE NAV LINK HIGHLIGHTING
   ========================================== */

function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  const navObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.remove('text-brand-600', 'font-semibold');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('text-brand-600', 'font-semibold');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => navObs.observe(s));
}

/* ==========================================
   GLOBAL SCOPE ATTACHMENT
   ========================================== */

window.openCart = openCart;
window.closeCart = closeCart;
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.addWishlist = addWishlist;
window.submitEnquiry = submitEnquiry;

/* ==========================================
   DOM LOAD INITIALIZATION
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initWeightSelectors();
  updateCartUI();
  initRevealAnimations();
  initCounters();
  initLogoAnimation();
  initImageFade();
  initActiveNavLinks();
});