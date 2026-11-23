/**
 * ============================================================================
 * NEO // AXIOM — Underground Streetwear & Sneaker Lab
 * Client-Side Interactive Engine
 * • Real-time Matrix Catalog Filtering & Sorting
 * • Stash Bag (Cart) & Wishlist Vault State Management
 * • Web Audio API Synthesized UI Sound Effects
 * • Live Drop Countdown Timer
 * • Quick Spec Modal & Simulated Dispatch Checkout
 * ============================================================================
 */

(function () {
  'use strict';

  // --- STATE ---
  const state = {
    activeCategory: 'all',
    searchQuery: '',
    sortBy: 'featured',
    isPosterView: false,
    cart: JSON.parse(localStorage.getItem('axiom_cart') || '[]'),
    wishlist: JSON.parse(localStorage.getItem('axiom_wishlist') || '[]'),
    appliedCoupon: null,
    theme: localStorage.getItem('axiom_theme') || 'dark',
    soundEnabled: localStorage.getItem('axiom_sound') !== 'false',
    quickViewProduct: null,
    quickViewSelectedSize: null,
    quickViewSelectedColor: null,
    quickViewQuantity: 1
  };

  const FREE_SHIPPING_TARGET = 150;
  const STANDARD_SHIPPING_COST = 15;

  // --- SYNTHESIZED WEB AUDIO SFX ENGINE ---
  let audioCtx = null;
  function playBeep(freq = 800, duration = 0.05, type = 'sine') {
    if (!state.soundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // AudioContext not allowed or unsupported
    }
  }

  // --- DOM REFERENCES ---
  const doc = document.documentElement;
  const productGrid = document.getElementById('productGrid');
  const emptyNotice = document.getElementById('emptyNotice');
  const resultsCountTxt = document.getElementById('resultsCountTxt');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  const clearEmptyQueryBtn = document.getElementById('clearEmptyQueryBtn');
  const catalogSort = document.getElementById('catalogSort');
  const catalogSearch = document.getElementById('catalogSearch');
  const btnDenseGrid = document.getElementById('btnDenseGrid');
  const btnPosterGrid = document.getElementById('btnPosterGrid');
  const filterPills = document.querySelectorAll('.pill-chip');

  // Header & Controls
  const themeBtn = document.getElementById('themeBtn');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const searchBtn = document.getElementById('searchBtn');
  const searchDropdown = document.getElementById('searchDropdown');
  const hudSearchInput = document.getElementById('hudSearchInput');
  const closeSearchBtn = document.getElementById('closeSearchBtn');
  const cartBtn = document.getElementById('cartBtn');
  const wishlistBtn = document.getElementById('wishlistBtn');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeMobileBtn = document.getElementById('closeMobileBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const screenBackdrop = document.getElementById('screenBackdrop');

  // Badges
  const cartCount = document.getElementById('cartCount');
  const wishlistCount = document.getElementById('wishlistCount');
  const cartBadgeText = document.getElementById('cartBadgeText');
  const wishlistBadgeText = document.getElementById('wishlistBadgeText');

  // Cart Drawer Elements
  const cartDrawer = document.getElementById('cartDrawer');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartItemList = document.getElementById('cartItemList');
  const emptyStashNotice = document.getElementById('emptyStashNotice');
  const emptyExploreBtn = document.getElementById('emptyExploreBtn');
  const freeShippingStatus = document.getElementById('freeShippingStatus');
  const shippingMeterFill = document.getElementById('shippingMeterFill');
  const voucherCode = document.getElementById('voucherCode');
  const applyVoucherBtn = document.getElementById('applyVoucherBtn');
  const voucherAlert = document.getElementById('voucherAlert');
  const subtotalVal = document.getElementById('subtotalVal');
  const discountRow = document.getElementById('discountRow');
  const discountName = document.getElementById('discountName');
  const discountVal = document.getElementById('discountVal');
  const shippingVal = document.getElementById('shippingVal');
  const totalVal = document.getElementById('totalVal');
  const proceedCheckoutBtn = document.getElementById('proceedCheckoutBtn');

  // Wishlist Drawer Elements
  const wishlistDrawer = document.getElementById('wishlistDrawer');
  const closeWishlistBtn = document.getElementById('closeWishlistBtn');
  const wishlistItemList = document.getElementById('wishlistItemList');
  const emptyWishlistNotice = document.getElementById('emptyWishlistNotice');

  // Quick View Dialog
  const quickViewDialog = document.getElementById('quickViewDialog');
  const closeQvBtn = document.getElementById('closeQvBtn');
  const modalMainImg = document.getElementById('modalMainImg');
  const modalBadge = document.getElementById('modalBadge');
  const modalThumb1 = document.getElementById('modalThumb1');
  const modalThumb2 = document.getElementById('modalThumb2');
  const modalThumbImg1 = document.getElementById('modalThumbImg1');
  const modalThumbImg2 = document.getElementById('modalThumbImg2');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalStars = document.getElementById('modalStars');
  const modalReviewCount = document.getElementById('modalReviewCount');
  const modalPrice = document.getElementById('modalPrice');
  const modalOrigPrice = document.getElementById('modalOrigPrice');
  const modalDiscTag = document.getElementById('modalDiscTag');
  const modalDesc = document.getElementById('modalDesc');
  const modalTechSpecs = document.getElementById('modalTechSpecs');
  const modalColorName = document.getElementById('modalColorName');
  const modalSwatches = document.getElementById('modalSwatches');
  const modalSizeName = document.getElementById('modalSizeName');
  const modalSizes = document.getElementById('modalSizes');
  const modalQtyMinus = document.getElementById('modalQtyMinus');
  const modalQtyPlus = document.getElementById('modalQtyPlus');
  const modalQtyVal = document.getElementById('modalQtyVal');
  const modalAddCartBtn = document.getElementById('modalAddCartBtn');
  const modalWishlistBtn = document.getElementById('modalWishlistBtn');

  // Checkout Dialog
  const checkoutDialog = document.getElementById('checkoutDialog');
  const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
  const coForm = document.getElementById('coForm');
  const coCount = document.getElementById('coCount');
  const coThumbs = document.getElementById('coThumbs');
  const coPayable = document.getElementById('coPayable');

  // Drop Pass Form
  const dropPassForm = document.getElementById('dropPassForm');
  const passEmail = document.getElementById('passEmail');
  const passFeedback = document.getElementById('passFeedback');

  // Toast Stack
  const toastHUD = document.getElementById('toastHUD');

  // --- INITIALIZATION ---
  function init() {
    setTheme(state.theme);
    updateAudioUI();
    updatePillCounts();
    renderCatalog();
    updateBadges();
    renderCart();
    renderWishlist();
    startCountdown();
    bindEvents();
  }

  // --- THEME ---
  function setTheme(theme) {
    state.theme = theme;
    doc.setAttribute('data-theme', theme);
    localStorage.setItem('axiom_theme', theme);

    const darkTxt = document.querySelector('.theme-icon-dark');
    const lightTxt = document.querySelector('.theme-icon-light');
    if (darkTxt && lightTxt) {
      if (theme === 'dark') {
        darkTxt.classList.remove('hidden');
        lightTxt.classList.add('hidden');
      } else {
        darkTxt.classList.add('hidden');
        lightTxt.classList.remove('hidden');
      }
    }
  }

  function toggleTheme() {
    playBeep(900, 0.08, 'triangle');
    const next = state.theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    showToast(`THEME PROTOCOL: ${next.toUpperCase()}`);
  }

  // --- AUDIO UI ---
  function updateAudioUI() {
    const onIcon = document.querySelector('.audio-on-icon');
    const offIcon = document.querySelector('.audio-off-icon');
    if (onIcon && offIcon) {
      onIcon.classList.toggle('hidden', !state.soundEnabled);
      offIcon.classList.toggle('hidden', state.soundEnabled);
    }
  }

  function toggleAudio() {
    state.soundEnabled = !state.soundEnabled;
    localStorage.setItem('axiom_sound', state.soundEnabled);
    updateAudioUI();
    if (state.soundEnabled) {
      playBeep(1200, 0.06);
      showToast('AUDIO FEEDBACK: ACTIVE');
    } else {
      showToast('AUDIO FEEDBACK: MUTED');
    }
  }

  // --- LIVE COUNTDOWN TIMER ---
  function startCountdown() {
    let secondsLeft = 4 * 3600 + 32 * 60 + 19;
    const cdEl = document.getElementById('dropCountdown');
    const cdMirror = document.querySelector('.dropCountdownMirror');

    setInterval(() => {
      secondsLeft--;
      if (secondsLeft <= 0) secondsLeft = 12 * 3600; // loop
      const h = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
      const m = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
      const s = String(secondsLeft % 60).padStart(2, '0');
      const timeStr = `${h}:${m}:${s}`;
      if (cdEl) cdEl.textContent = timeStr;
      if (cdMirror) cdMirror.textContent = timeStr;
    }, 1000);
  }

  // --- PILL COUNTS ---
  function updatePillCounts() {
    const total = streetwearProducts.length;
    const newCount = streetwearProducts.filter(p => p.isNew).length;
    const clothCount = streetwearProducts.filter(p => p.category === 'clothing').length;
    const footCount = streetwearProducts.filter(p => p.category === 'footwear').length;
    const accCount = streetwearProducts.filter(p => p.category === 'accessories').length;
    const saleCount = streetwearProducts.filter(p => p.isSale).length;

    const cntAll = document.getElementById('cntAll');
    const cntNew = document.getElementById('cntNew');
    const cntClothing = document.getElementById('cntClothing');
    const cntFootwear = document.getElementById('cntFootwear');
    const cntAccessories = document.getElementById('cntAccessories');
    const cntSale = document.getElementById('cntSale');

    if (cntAll) cntAll.textContent = total;
    if (cntNew) cntNew.textContent = newCount;
    if (cntClothing) cntClothing.textContent = clothCount;
    if (cntFootwear) cntFootwear.textContent = footCount;
    if (cntAccessories) cntAccessories.textContent = accCount;
    if (cntSale) cntSale.textContent = saleCount;
  }

  // --- FILTER & SORT LOGIC ---
  function getFilteredList() {
    let list = [...streetwearProducts];

    if (state.activeCategory === 'new-drops') {
      list = list.filter(p => p.isNew);
    } else if (state.activeCategory === 'sale') {
      list = list.filter(p => p.isSale);
    } else if (state.activeCategory !== 'all') {
      list = list.filter(p => p.category === state.activeCategory);
    }

    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase().trim();
      list = list.filter(p => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.techSpecs.toLowerCase().includes(q) ||
          p.colors.some(c => c.name.toLowerCase().includes(q))
        );
      });
    }

    switch (state.sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
        break;
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return list;
  }

  function getFallbackSvg(name) {
    const cleanName = name ? name.replace(/"/g, '') : 'NEO AXIOM';
    return `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22600%22%20height%3D%22800%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23121216%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2248%25%22%20fill%3D%22%23D8FF00%22%20font-family%3D%22monospace%22%20font-size%3D%2222%22%20font-weight%3D%22bold%22%20text-anchor%3D%22middle%22%3ENEO%20%2F%2F%20AXIOM%3C%2Ftext%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20fill%3D%22%238E8E9F%22%20font-family%3D%22monospace%22%20font-size%3D%2213%22%20text-anchor%3D%22middle%22%3E${encodeURIComponent(cleanName)}%3C%2Ftext%3E%3C%2Fsvg%3E`;
  }

  function renderCatalog() {
    const items = getFilteredList();

    const activeCatLabel = state.activeCategory === 'all' ? 'ALL' : state.activeCategory.toUpperCase();
    resultsCountTxt.textContent = `SHOWING ${items.length} SILHOUETTES [${activeCatLabel}]`;

    if (state.activeCategory !== 'all' || state.searchQuery.trim() !== '') {
      resetFiltersBtn.classList.remove('hidden');
    } else {
      resetFiltersBtn.classList.add('hidden');
    }

    if (items.length === 0) {
      productGrid.innerHTML = '';
      emptyNotice.classList.remove('hidden');
      return;
    }
    emptyNotice.classList.add('hidden');

    const html = items.map(product => {
      const isBookmarked = state.wishlist.some(w => w.id === product.id);

      let badgeMarkup = '';
      if (product.badge) {
        badgeMarkup = `<span class="card-hud-badge ${product.badgeType}">${product.badge}</span>`;
      }

      const origPriceHtml = product.originalPrice
        ? `<span class="card-slashed-price">$${product.originalPrice}</span>`
        : '';
      const discHtml = product.discount
        ? `<span class="card-disc-badge">${product.discount}</span>`
        : '';

      const dotsHtml = product.colors.map(c => `
        <span class="c-dot" style="background-color: ${c.hex};" title="${c.name}"></span>
      `).join('');

      const sizesStr = product.sizes.join(' • ');

      return `
        <article class="neo-card" data-id="${product.id}">
          <!-- Visual Media with Dual-Angle Reveal -->
          <div class="card-visual" onclick="window.AxiomApp.openQuickView('${product.id}')">
            ${badgeMarkup}

            <!-- Vault Bookmark (Absolute Top-Right) -->
            <button 
              class="card-vault-btn ${isBookmarked ? 'active' : ''}" 
              title="${isBookmarked ? 'Remove from Vault' : 'Save to Vault'}"
              aria-label="Bookmark Piece"
              onclick="event.stopPropagation(); window.AxiomApp.toggleWishlist('${product.id}')"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>

            <!-- Primary Photo -->
            <img 
              class="img-main" 
              src="${product.image}" 
              alt="${product.name}" 
              loading="lazy"
              onerror="this.onerror=null; this.src='${getFallbackSvg(product.name)}';"
            >

            <!-- Secondary Photo (Revealed on hover via CSS) -->
            <img 
              class="img-alt" 
              src="${product.hoverImage}" 
              alt="${product.name} Alternate Angle" 
              loading="lazy"
              onerror="this.onerror=null; this.src='${getFallbackSvg(product.name)}';"
            >

            <!-- Action Overlays (Slide-up on hover) -->
            <div class="card-hover-deck" onclick="event.stopPropagation()">
              <button 
                class="btn-card-stash" 
                onclick="window.AxiomApp.quickAddToCart('${product.id}')"
              >
                <span>+ STASH</span>
              </button>

              <button 
                class="btn-card-inspect" 
                title="Inspect Technical Specs" 
                onclick="window.AxiomApp.openQuickView('${product.id}')"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
          </div>

          <!-- Metadata Box -->
          <div class="card-meta-box">
            <div class="card-spec-tag">
              <span>// ${product.subCategory.toUpperCase()}</span>
              <span class="card-rating-txt">★ ${product.rating.toFixed(1)}</span>
            </div>

            <h3 class="card-item-title" onclick="window.AxiomApp.openQuickView('${product.id}')">${product.name}</h3>

            <p class="card-tech-preview">${product.techSpecs}</p>

            <div class="card-pricing-row">
              <span class="card-cur-price">$${product.price}</span>
              ${origPriceHtml}
              ${discHtml}
            </div>

            <div class="card-footer-spec">
              <div class="card-dots">${dotsHtml}</div>
              <span class="card-sizes-str">${sizesStr}</span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    productGrid.innerHTML = html;
  }

  // --- CART MANAGEMENT ---
  function saveCart() {
    localStorage.setItem('axiom_cart', JSON.stringify(state.cart));
    updateBadges();
    renderCart();
  }

  function addToCart(productId, size, color, qty = 1) {
    playBeep(1100, 0.08);
    const product = streetwearProducts.find(p => p.id === productId);
    if (!product) return;

    const chosenSize = size || product.sizes[0];
    const chosenColor = color || product.colors[0];

    const idx = state.cart.findIndex(
      item => item.id === productId && item.size === chosenSize && item.color.name === chosenColor.name
    );

    if (idx > -1) {
      state.cart[idx].quantity += qty;
    } else {
      state.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        subCategory: product.subCategory,
        size: chosenSize,
        color: chosenColor,
        quantity: qty
      });
    }

    saveCart();
    showToast(`STASHED: ${product.name}`);
    openCartDrawer();
  }

  function quickAddToCart(productId) {
    const product = streetwearProducts.find(p => p.id === productId);
    if (!product) return;
    addToCart(productId, product.sizes[0], product.colors[0], 1);
  }

  function updateCartQuantity(index, delta) {
    playBeep(950, 0.04);
    if (!state.cart[index]) return;
    state.cart[index].quantity += delta;
    if (state.cart[index].quantity <= 0) {
      state.cart.splice(index, 1);
      showToast('PIECE PURGED FROM STASH');
    }
    saveCart();
  }

  function removeFromCart(index) {
    playBeep(700, 0.05);
    if (!state.cart[index]) return;
    state.cart.splice(index, 1);
    saveCart();
    showToast('PIECE REMOVED');
  }

  function getCartSubtotal() {
    return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function renderCart() {
    const subtotal = getCartSubtotal();
    const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadgeText.textContent = `[${count} ITEMS]`;

    if (state.cart.length === 0) {
      cartItemList.innerHTML = '';
      cartItemList.appendChild(emptyStashNotice);
      emptyStashNotice.classList.remove('hidden');

      subtotalVal.textContent = '$0.00';
      discountVal.textContent = '-$0.00';
      discountRow.classList.add('hidden');
      shippingVal.textContent = '$0.00';
      totalVal.textContent = '$0.00';

      freeShippingStatus.innerHTML = `Add <strong>$${FREE_SHIPPING_TARGET.toFixed(2)}</strong> more for Free Global Priority Dispatch`;
      shippingMeterFill.style.width = '0%';
      return;
    }

    emptyStashNotice.classList.add('hidden');

    // Free shipping calculation
    const remaining = Math.max(0, FREE_SHIPPING_TARGET - subtotal);
    const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_TARGET) * 100));
    shippingMeterFill.style.width = `${progress}%`;

    let shippingFee = STANDARD_SHIPPING_COST;
    if (subtotal >= FREE_SHIPPING_TARGET) {
      shippingFee = 0;
      freeShippingStatus.innerHTML = `⚡ <strong>FREE GLOBAL EXPRESS DISPATCH UNLOCKED!</strong>`;
    } else {
      freeShippingStatus.innerHTML = `Add <strong>$${remaining.toFixed(2)}</strong> more for Free Global Priority Dispatch`;
    }

    let discountAmount = 0;
    if (state.appliedCoupon) {
      discountAmount = Math.round((subtotal * state.appliedCoupon.discountPercent) / 100);
      discountRow.classList.remove('hidden');
      discountName.textContent = state.appliedCoupon.code;
      discountVal.textContent = `-$${discountAmount.toFixed(2)}`;
    } else {
      discountRow.classList.add('hidden');
    }

    const netTotal = Math.max(0, subtotal - discountAmount + shippingFee);

    subtotalVal.textContent = `$${subtotal.toFixed(2)}`;
    shippingVal.textContent = shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`;
    totalVal.textContent = `$${netTotal.toFixed(2)}`;

    const html = state.cart.map((item, idx) => `
      <div class="drawer-item-row">
        <img 
          src="${item.image}" 
          alt="${item.name}" 
          class="drawer-item-thumb"
          onerror="this.onerror=null; this.src='${getFallbackSvg(item.name)}';"
        >
        <div class="drawer-item-spec">
          <h4 class="drawer-item-title">${item.name}</h4>
          <span class="drawer-item-tags">SIZE: ${item.size} • SHADE: ${item.color.name}</span>
          <div class="drawer-item-actions">
            <div class="cyber-stepper">
              <button class="step-btn" onclick="window.AxiomApp.updateCartQuantity(${idx}, -1)">−</button>
              <span class="step-val">${item.quantity}</span>
              <button class="step-btn" onclick="window.AxiomApp.updateCartQuantity(${idx}, 1)">+</button>
            </div>
            <span class="drawer-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            <button class="drawer-remove-btn" onclick="window.AxiomApp.removeFromCart(${idx})">PURGE</button>
          </div>
        </div>
      </div>
    `).join('');

    cartItemList.innerHTML = html;
  }

  // --- WISHLIST VAULT ---
  function saveWishlist() {
    localStorage.setItem('axiom_wishlist', JSON.stringify(state.wishlist));
    updateBadges();
    renderWishlist();
    renderCatalog();
  }

  function toggleWishlist(productId) {
    playBeep(1000, 0.05);
    const product = streetwearProducts.find(p => p.id === productId);
    if (!product) return;

    const idx = state.wishlist.findIndex(w => w.id === productId);
    if (idx > -1) {
      state.wishlist.splice(idx, 1);
      showToast(`UNBOOKMARKED: ${product.name}`);
    } else {
      state.wishlist.push(product);
      showToast(`VAULT BOOKMARKED: ${product.name}`);
    }
    saveWishlist();
  }

  function renderWishlist() {
    const count = state.wishlist.length;
    wishlistBadgeText.textContent = `[${count} PIECES]`;

    if (count === 0) {
      wishlistItemList.innerHTML = '';
      wishlistItemList.appendChild(emptyWishlistNotice);
      emptyWishlistNotice.classList.remove('hidden');
      return;
    }

    emptyWishlistNotice.classList.add('hidden');

    const html = state.wishlist.map(p => `
      <div class="drawer-item-row">
        <img 
          src="${p.image}" 
          alt="${p.name}" 
          class="drawer-item-thumb"
          onerror="this.onerror=null; this.src='${getFallbackSvg(p.name)}';"
        >
        <div class="drawer-item-spec">
          <h4 class="drawer-item-title">${p.name}</h4>
          <span class="drawer-item-tags">${p.subCategory.toUpperCase()} • $${p.price}</span>
          <div class="drawer-item-actions">
            <button 
              class="btn-cyber btn-volt btn-sm" 
              onclick="window.AxiomApp.quickAddToCart('${p.id}'); window.AxiomApp.toggleWishlist('${p.id}')"
            >
              MOVE TO STASH
            </button>
            <button class="drawer-remove-btn" onclick="window.AxiomApp.toggleWishlist('${p.id}')">REMOVE</button>
          </div>
        </div>
      </div>
    `).join('');

    wishlistItemList.innerHTML = html;
  }

  // --- BADGES ---
  function updateBadges() {
    const cCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const wCount = state.wishlist.length;

    cartCount.textContent = cCount;
    wishlistCount.textContent = wCount;
  }

  // --- QUICK SPEC VIEW ---
  function openQuickView(productId) {
    playBeep(850, 0.05);
    const product = streetwearProducts.find(p => p.id === productId);
    if (!product) return;

    state.quickViewProduct = product;
    state.quickViewSelectedSize = product.sizes[0];
    state.quickViewSelectedColor = product.colors[0];
    state.quickViewQuantity = 1;

    modalMainImg.src = product.image;
    modalThumbImg1.src = product.image;
    modalThumbImg2.src = product.hoverImage;

    if (product.badge) {
      modalBadge.textContent = product.badge;
      modalBadge.className = `qv-corner-badge ${product.badgeType}`;
      modalBadge.classList.remove('hidden');
    } else {
      modalBadge.classList.add('hidden');
    }

    modalCategory.textContent = `// ${product.category.toUpperCase()} • ${product.subCategory.toUpperCase()}`;
    modalTitle.textContent = product.name;
    modalStars.textContent = '★'.repeat(Math.round(product.rating));
    modalReviewCount.textContent = `${product.rating.toFixed(1)} (${product.reviews} DISPATCH LOGS)`;

    modalPrice.textContent = `$${product.price}`;
    if (product.originalPrice) {
      modalOrigPrice.textContent = `$${product.originalPrice}`;
      modalOrigPrice.classList.remove('hidden');
    } else {
      modalOrigPrice.classList.add('hidden');
    }

    if (product.discount) {
      modalDiscTag.textContent = product.discount;
      modalDiscTag.classList.remove('hidden');
    } else {
      modalDiscTag.classList.add('hidden');
    }

    modalDesc.textContent = product.description;
    modalTechSpecs.textContent = product.techSpecs;
    modalColorName.textContent = state.quickViewSelectedColor.name;
    modalSizeName.textContent = state.quickViewSelectedSize;
    modalQtyVal.textContent = state.quickViewQuantity;

    // Swatches
    modalSwatches.innerHTML = product.colors.map((c, i) => `
      <button 
        class="m-swatch ${i === 0 ? 'active' : ''}" 
        style="background-color: ${c.hex};" 
        data-index="${i}"
        title="${c.name}"
      ></button>
    `).join('');

    // Sizes
    modalSizes.innerHTML = product.sizes.map((s, i) => `
      <button class="m-size-pill ${i === 0 ? 'active' : ''}" data-size="${s}">${s}</button>
    `).join('');

    // Wishlist Button state
    const isBookmarked = state.wishlist.some(w => w.id === product.id);
    modalWishlistBtn.classList.toggle('active', isBookmarked);

    modalThumb1.classList.add('active');
    modalThumb2.classList.remove('active');

    if (typeof quickViewDialog.showModal === 'function') {
      quickViewDialog.showModal();
    } else {
      quickViewDialog.setAttribute('open', '');
    }
  }

  function closeQuickView() {
    playBeep(600, 0.04);
    if (typeof quickViewDialog.close === 'function') {
      quickViewDialog.close();
    } else {
      quickViewDialog.removeAttribute('open');
    }
  }

  // --- CHECKOUT SIMULATION ---
  function openCheckout() {
    if (state.cart.length === 0) {
      showToast('STASH IS EMPTY. SELECT PIECES.');
      return;
    }
    closeCart();
    playBeep(900, 0.08);

    const subtotal = getCartSubtotal();
    let discount = 0;
    if (state.appliedCoupon) {
      discount = Math.round((subtotal * state.appliedCoupon.discountPercent) / 100);
    }
    const shipping = subtotal >= FREE_SHIPPING_TARGET ? 0 : STANDARD_SHIPPING_COST;
    const finalVal = Math.max(0, subtotal - discount + shipping);

    coCount.textContent = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    coPayable.textContent = `$${finalVal.toFixed(2)}`;

    coThumbs.innerHTML = state.cart.map(item => `
      <img src="${item.image}" alt="${item.name}" class="co-mini-img">
    `).join('');

    if (typeof checkoutDialog.showModal === 'function') {
      checkoutDialog.showModal();
    } else {
      checkoutDialog.setAttribute('open', '');
    }
  }

  function closeCheckout() {
    if (typeof checkoutDialog.close === 'function') {
      checkoutDialog.close();
    } else {
      checkoutDialog.removeAttribute('open');
    }
  }

  // --- DRAWERS ---
  function openCart() {
    closeWishlist();
    closeMobile();
    playBeep(750, 0.04);
    cartDrawer.classList.add('open');
    screenBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer.classList.remove('open');
    screenBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  function openWishlist() {
    closeCart();
    closeMobile();
    playBeep(750, 0.04);
    wishlistDrawer.classList.add('open');
    screenBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeWishlist() {
    wishlistDrawer.classList.remove('open');
    screenBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  function openMobile() {
    mobileMenu.classList.add('open');
    screenBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobile() {
    mobileMenu.classList.remove('open');
    screenBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  // --- TOAST HUD ---
  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'hud-toast';
    t.innerHTML = `<span>⚡</span> <span>${msg}</span>`;
    toastHUD.appendChild(t);

    setTimeout(() => {
      t.classList.add('fade-out');
      setTimeout(() => {
        if (t.parentNode) t.parentNode.removeChild(t);
      }, 250);
    }, 2800);
  }

  // --- EVENT BINDINGS ---
  function bindEvents() {
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    if (audioToggleBtn) audioToggleBtn.addEventListener('click', toggleAudio);

    // Search Toggle
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        playBeep(850, 0.04);
        const isOpen = searchDropdown.classList.toggle('open');
        if (isOpen && hudSearchInput) hudSearchInput.focus();
      });
    }

    if (closeSearchBtn) {
      closeSearchBtn.addEventListener('click', () => {
        searchDropdown.classList.remove('open');
      });
    }

    if (hudSearchInput) {
      hudSearchInput.addEventListener('input', e => {
        state.searchQuery = e.target.value;
        if (catalogSearch) catalogSearch.value = e.target.value;
        renderCatalog();
      });
    }

    document.querySelectorAll('.tag-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tag = btn.getAttribute('data-tag');
        if (hudSearchInput) hudSearchInput.value = tag;
        if (catalogSearch) catalogSearch.value = tag;
        state.searchQuery = tag;
        renderCatalog();
        document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
      });
    });

    // In-page Catalog Search
    if (catalogSearch) {
      catalogSearch.addEventListener('input', e => {
        state.searchQuery = e.target.value;
        renderCatalog();
      });
    }

    // Sort Dropdown
    if (catalogSort) {
      catalogSort.addEventListener('change', e => {
        playBeep(800, 0.04);
        state.sortBy = e.target.value;
        renderCatalog();
      });
    }

    // Filter Chips
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        playBeep(850, 0.04);
        filterPills.forEach(p => {
          p.classList.remove('active');
          p.setAttribute('aria-selected', 'false');
        });
        pill.classList.add('active');
        pill.setAttribute('aria-selected', 'true');
        state.activeCategory = pill.getAttribute('data-category');
        renderCatalog();
      });
    });

    // Nav Links Category Delegation
    document.querySelectorAll('.desktop-menu .nav-item, .mob-link, .f-filter').forEach(link => {
      link.addEventListener('click', e => {
        const cat = link.getAttribute('data-filter');
        if (cat) {
          e.preventDefault();
          playBeep(850, 0.04);
          state.activeCategory = cat;

          filterPills.forEach(p => {
            const matches = p.getAttribute('data-category') === cat;
            p.classList.toggle('active', matches);
            p.setAttribute('aria-selected', matches ? 'true' : 'false');
          });

          document.querySelectorAll('.desktop-menu .nav-item').forEach(ni => {
            ni.classList.toggle('active', ni.getAttribute('data-filter') === cat);
          });

          closeMobile();
          renderCatalog();

          const catalogEl = document.getElementById('catalog');
          if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Grid Density Buttons
    if (btnDenseGrid && btnPosterGrid) {
      btnDenseGrid.addEventListener('click', () => {
        playBeep(800, 0.04);
        btnDenseGrid.classList.add('active');
        btnPosterGrid.classList.remove('active');
        productGrid.classList.remove('poster-view');
      });

      btnPosterGrid.addEventListener('click', () => {
        playBeep(800, 0.04);
        btnPosterGrid.classList.add('active');
        btnDenseGrid.classList.remove('active');
        productGrid.classList.add('poster-view');
      });
    }

    // Reset Filters
    function resetFilters() {
      state.activeCategory = 'all';
      state.searchQuery = '';
      if (catalogSearch) catalogSearch.value = '';
      if (hudSearchInput) hudSearchInput.value = '';

      filterPills.forEach(p => {
        const isAll = p.getAttribute('data-category') === 'all';
        p.classList.toggle('active', isAll);
        p.setAttribute('aria-selected', isAll ? 'true' : 'false');
      });

      renderCatalog();
    }
    if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetFilters);
    if (clearEmptyQueryBtn) clearEmptyQueryBtn.addEventListener('click', resetFilters);

    // Manifesto Shop Button
    const manifestoShopBtn = document.getElementById('manifestoShopBtn');
    if (manifestoShopBtn) {
      manifestoShopBtn.addEventListener('click', () => {
        state.activeCategory = 'clothing';
        filterPills.forEach(p => {
          const match = p.getAttribute('data-category') === 'clothing';
          p.classList.toggle('active', match);
          p.setAttribute('aria-selected', match ? 'true' : 'false');
        });
        renderCatalog();
        document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
        showToast('ACTIVE FILTER: STREETWEAR');
      });
    }

    // Drawer Toggles
    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (emptyExploreBtn) {
      emptyExploreBtn.addEventListener('click', () => {
        closeCart();
        document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
      });
    }

    if (wishlistBtn) wishlistBtn.addEventListener('click', openWishlist);
    if (closeWishlistBtn) closeWishlistBtn.addEventListener('click', closeWishlist);

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobile);
    if (closeMobileBtn) closeMobileBtn.addEventListener('click', closeMobile);

    if (screenBackdrop) {
      screenBackdrop.addEventListener('click', () => {
        closeCart();
        closeWishlist();
        closeMobile();
        if (searchDropdown) searchDropdown.classList.remove('open');
      });
    }

    // Voucher Redemption
    if (applyVoucherBtn && voucherCode) {
      applyVoucherBtn.addEventListener('click', () => {
        const code = voucherCode.value.trim().toUpperCase();
        if (code === 'AXIOM20') {
          playBeep(1200, 0.1);
          state.appliedCoupon = { code: 'AXIOM20', discountPercent: 20 };
          voucherAlert.className = 'voucher-alert ok';
          voucherAlert.textContent = '✓ 20% PROTOCOL DISCOUNT APPLIED';
          showToast('PROTOCOL AXIOM20: 20% DISCOUNT ACTIVE');
        } else if (code === 'DROP10') {
          playBeep(1200, 0.1);
          state.appliedCoupon = { code: 'DROP10', discountPercent: 10 };
          voucherAlert.className = 'voucher-alert ok';
          voucherAlert.textContent = '✓ 10% DISCOUNT APPLIED';
          showToast('PROTOCOL DROP10 ACTIVE');
        } else {
          playBeep(400, 0.1, 'sawtooth');
          voucherAlert.className = 'voucher-alert err';
          voucherAlert.textContent = 'INVALID PROTOCOL. TRY AXIOM20.';
          showToast('UNKNOWN ACCESS CODE');
        }
        renderCart();
      });
    }

    // Checkout Modal
    if (proceedCheckoutBtn) proceedCheckoutBtn.addEventListener('click', openCheckout);
    if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', closeCheckout);

    if (coForm) {
      coForm.addEventListener('submit', e => {
        e.preventDefault();
        playBeep(1400, 0.15);
        const name = document.getElementById('fName').value;
        closeCheckout();
        showToast(`DISPATCH CONFIRMED FOR ${name.toUpperCase()}! ORDER EN ROUTE.`);
        state.cart = [];
        state.appliedCoupon = null;
        saveCart();
      });
    }

    // Modal Thumbnails
    if (modalThumb1 && modalThumb2) {
      modalThumb1.addEventListener('click', () => {
        if (!state.quickViewProduct) return;
        modalMainImg.src = state.quickViewProduct.image;
        modalThumb1.classList.add('active');
        modalThumb2.classList.remove('active');
      });
      modalThumb2.addEventListener('click', () => {
        if (!state.quickViewProduct) return;
        modalMainImg.src = state.quickViewProduct.hoverImage;
        modalThumb2.classList.add('active');
        modalThumb1.classList.remove('active');
      });
    }

    // Modal Swatches & Sizes
    if (modalSwatches) {
      modalSwatches.addEventListener('click', e => {
        const sw = e.target.closest('.m-swatch');
        if (!sw || !state.quickViewProduct) return;
        const idx = parseInt(sw.getAttribute('data-index'), 10);
        state.quickViewSelectedColor = state.quickViewProduct.colors[idx];
        modalColorName.textContent = state.quickViewSelectedColor.name;
        modalSwatches.querySelectorAll('.m-swatch').forEach(s => s.classList.remove('active'));
        sw.classList.add('active');
      });
    }

    if (modalSizes) {
      modalSizes.addEventListener('click', e => {
        const pill = e.target.closest('.m-size-pill');
        if (!pill) return;
        state.quickViewSelectedSize = pill.getAttribute('data-size');
        modalSizeName.textContent = state.quickViewSelectedSize;
        modalSizes.querySelectorAll('.m-size-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    }

    if (modalQtyMinus) {
      modalQtyMinus.addEventListener('click', () => {
        if (state.quickViewQuantity > 1) {
          state.quickViewQuantity--;
          modalQtyVal.textContent = state.quickViewQuantity;
        }
      });
    }

    if (modalQtyPlus) {
      modalQtyPlus.addEventListener('click', () => {
        state.quickViewQuantity++;
        modalQtyVal.textContent = state.quickViewQuantity;
      });
    }

    if (modalAddCartBtn) {
      modalAddCartBtn.addEventListener('click', () => {
        if (!state.quickViewProduct) return;
        addToCart(
          state.quickViewProduct.id,
          state.quickViewSelectedSize,
          state.quickViewSelectedColor,
          state.quickViewQuantity
        );
        closeQuickView();
      });
    }

    if (modalWishlistBtn) {
      modalWishlistBtn.addEventListener('click', () => {
        if (!state.quickViewProduct) return;
        toggleWishlist(state.quickViewProduct.id);
        const isBookmarked = state.wishlist.some(w => w.id === state.quickViewProduct.id);
        modalWishlistBtn.classList.toggle('active', isBookmarked);
      });
    }

    if (closeQvBtn) closeQvBtn.addEventListener('click', closeQuickView);

    // Drop Pass VIP Form
    if (dropPassForm) {
      dropPassForm.addEventListener('submit', e => {
        e.preventDefault();
        const em = passEmail.value.trim();
        if (em && em.includes('@')) {
          playBeep(1200, 0.1);
          passFeedback.className = 'pass-feedback ok';
          passFeedback.textContent = '✓ VIP KEY GENERATED. CODE AXIOM20 FOR 20% OFF.';
          passEmail.value = '';
          showToast('DROP PASS GRANTED. CODE AXIOM20 REGISTERED.');
        } else {
          playBeep(450, 0.08);
          passFeedback.className = 'pass-feedback err';
          passFeedback.textContent = 'ENTER VALID TERMINAL EMAIL.';
        }
      });
    }

    // Protocol helper toasts
    const fShipping = document.getElementById('fShipping');
    if (fShipping) fShipping.addEventListener('click', () => showToast('DHL Express: Tracked worldwide within 48h.'));
    const fReturns = document.getElementById('fReturns');
    if (fReturns) fReturns.addEventListener('click', () => showToast('14-day prepaid carbon-neutral vault return labels.'));
    const fSizing = document.getElementById('fSizing');
    if (fSizing) fSizing.addEventListener('click', () => showToast('Oversized boxy fit across all tops. Sizing chart in quick spec.'));
    const fCare = document.getElementById('fCare');
    if (fCare) fCare.addEventListener('click', () => showToast('Cold hand-wash only. Line dry technical Cordura shells.'));

    // Global Escape
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeQuickView();
        closeCheckout();
        closeCart();
        closeWishlist();
        closeMobile();
        if (searchDropdown) searchDropdown.classList.remove('open');
      }
    });
  }

  // Public Exposure for Inline Handlers
  window.AxiomApp = {
    openQuickView,
    quickAddToCart,
    toggleWishlist,
    updateCartQuantity,
    removeFromCart
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
