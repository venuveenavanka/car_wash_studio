/* ==========================================================================
   RAW STUDIOS — APPLICATION STATE & INTERACTIVE LOGIC
   Live Price Calculator, Booking Engine, Admin Portal, & State Store
   ========================================================================== */

// --- INITIAL STATE DATA ---
const defaultState = {
  selectedCategory: 'Sedan',
  selectedVehicle: { id: 'bmw-5', name: 'BMW 5 Series', category: 'Sedan', basePrice: 0 },
  selectedServices: ['paint-correction', 'ceramic-coating'],
  selectedPpfFinish: 'gloss_ppf',
  selectedPpfCoverage: 'full-body',
  selectedCeramicTier: '3-year',
  selectedCorrectionStage: '2-step',
  appliedCoupon: null,
  couponDiscountPct: 0,
  
  // Dynamic Pricing Database (Editable via Admin)
  vehicles: [
    { id: 'bmw-3', name: 'BMW 3 Series', category: 'Sedan', basePrice: 0 },
    { id: 'bmw-5', name: 'BMW 5 Series', category: 'Sedan', basePrice: 2000 },
    { id: 'merc-c', name: 'Mercedes C-Class', category: 'Sedan', basePrice: 0 },
    { id: 'merc-e', name: 'Mercedes E-Class', category: 'Sedan', basePrice: 2000 },
    { id: 'audi-a4', name: 'Audi A4', category: 'Sedan', basePrice: 0 },
    { id: 'audi-q5', name: 'Audi Q5', category: 'SUV', basePrice: 3000 },
    { id: 'fortuner', name: 'Toyota Fortuner', category: 'SUV', basePrice: 3500 },
    { id: 'creta', name: 'Hyundai Creta', category: 'SUV', basePrice: 0 },
    { id: 'harrier', name: 'Tata Harrier', category: 'SUV', basePrice: 1000 },
    { id: 'porsche-911', name: 'Porsche 911', category: 'Sports', basePrice: 5000 },
    { id: 'merc-s', name: 'Mercedes S-Class', category: 'Luxury', basePrice: 6000 },
  ],

  services: [
    { id: 'premium-wash', name: 'Premium Wash', price: 1500, icon: 'fa-car-wash', desc: 'pH neutral snow foam wash, wheel deep clean, hydrophobic rinse.' },
    { id: 'interior-detail', name: 'Interior Detailing', price: 4000, icon: 'fa-couch', desc: 'Steam extraction, leather conditioning, dashboard UV coat.' },
    { id: 'exterior-detail', name: 'Exterior Detailing', price: 6000, icon: 'fa-sparkles', desc: 'Clay bar decontamination, iron remover, high-gloss sealant.' },
    { id: 'paint-correction', name: 'Paint Correction', price: 8000, icon: 'fa-wand-magic-sparkles', desc: 'Multi-stage swirl removal, optical mirror clarity.' },
    { id: 'ceramic-coating', name: 'Ceramic Coating', price: 8999, icon: 'fa-shield-halved', desc: '9H hardness nano-ceramic coating with hydrophobic barrier.' },
    { id: 'ppf', name: 'Full Body PPF', price: 125000, icon: 'fa-shield-cat', desc: 'Self-healing TPU clear paint protection film.' },
    { id: 'window-tint', name: 'Window Tint', price: 5000, icon: 'fa-sun', desc: 'Ceramic heat rejection window tinting.' },
    { id: 'alloy-restore', name: 'Alloy Restoration', price: 3500, icon: 'fa-circle-notch', desc: 'Curb rash repair & brake dust ceramic coating.' },
    { id: 'headlight-restore', name: 'Headlight Restoration', price: 2500, icon: 'fa-lightbulb', desc: 'UV oxidation removal & ceramic seal.' },
    { id: 'leather-protect', name: 'Leather Protection', price: 4500, icon: 'fa-chair', desc: 'Hydrophobic & anti-stain leather guard.' },
    { id: 'engine-detail', name: 'Engine Bay Detailing', price: 2000, icon: 'fa-engine', desc: 'Degreasing, steam clean & satin dressing.' }
  ],

  ceramicTiers: {
    '1-year': { name: '1 Year Protection', price: 4999, gloss: 85, duration: '12 Months' },
    '3-year': { name: '3 Year Protection', price: 8999, gloss: 95, duration: '36 Months' },
    '5-year': { name: '5 Year Protection', price: 14999, gloss: 98, duration: '60 Months' },
    '9-year': { name: '9 Year Protection', price: 24999, gloss: 100, duration: '108 Months' }
  },

  ppfCoveragePrices: {
    'front-bumper': 25000,
    'partial-front': 45000,
    'full-front': 65000,
    'full-body': 125000,
    'custom': 85000
  },

  correctionStages: {
    '1-step': { name: '1-Step Polish', price: 8000 },
    '2-step': { name: '2-Step Cut & Polish', price: 15000 },
    '3-step': { name: '3-Step Mirror Correction', price: 25000 }
  },

  bookings: [
    { id: 'RAW-89241', customer: 'Rahul M.', vehicle: 'BMW 5 Series', service: 'Full Body PPF + Ceramic', date: '2026-10-02', time: '11:30 AM', total: 149999, status: 'Confirmed' },
    { id: 'RAW-77109', customer: 'Vikram R.', vehicle: 'Porsche 911', service: '3-Step Paint Correction', date: '2026-10-04', time: '02:00 PM', total: 25000, status: 'In Studio' }
  ]
};

// Global Active App State
let state = JSON.parse(localStorage.getItem('raw_studios_state')) || defaultState;
state.ceramicTiers = defaultState.ceramicTiers;
state.services = defaultState.services;

const vehicleImages = {
  'bmw-5': {
    gloss_ppf: 'assets/images/bmw_5_gloss.png',
    matte_ppf: 'assets/images/bmw_5_matte.png',
    satin_ppf: 'assets/images/bmw_5_matte.png',
    ceramic_ppf: 'assets/images/bmw_5_gloss.png',
    original: 'assets/images/hero_car.png'
  },
  'bmw-3': {
    gloss_ppf: 'assets/images/bmw_5_gloss.png',
    matte_ppf: 'assets/images/bmw_5_matte.png',
    original: 'assets/images/hero_car.png'
  },
  'porsche-911': {
    gloss_ppf: 'assets/images/porsche_911.png',
    matte_ppf: 'assets/images/porsche_911.png',
    original: 'assets/images/porsche_911.png'
  },
  'audi-q5': {
    gloss_ppf: 'assets/images/audi_q5.png',
    matte_ppf: 'assets/images/audi_q5.png',
    original: 'assets/images/audi_q5.png'
  },
  'fortuner': {
    gloss_ppf: 'assets/images/fortuner.png',
    matte_ppf: 'assets/images/fortuner.png',
    original: 'assets/images/fortuner.png'
  },
  'creta': {
    gloss_ppf: 'assets/images/fortuner.png',
    original: 'assets/images/fortuner.png'
  },
  'harrier': {
    gloss_ppf: 'assets/images/fortuner.png',
    original: 'assets/images/fortuner.png'
  },
  'merc-c': {
    gloss_ppf: 'assets/images/bmw_5_gloss.png',
    original: 'assets/images/hero_car.png'
  },
  'merc-e': {
    gloss_ppf: 'assets/images/bmw_5_gloss.png',
    original: 'assets/images/hero_car.png'
  },
  'merc-s': {
    gloss_ppf: 'assets/images/hero_car.png',
    original: 'assets/images/hero_car.png'
  },
  'audi-a4': {
    gloss_ppf: 'assets/images/bmw_5_gloss.png',
    original: 'assets/images/hero_car.png'
  }
};

// 360 Image Sequence State
let currentFrame = 1;
const totalFrames = 36;
let isDragging360 = false;
let startX = 0;

function updateRealCarDisplay() {
  const imgEl = document.getElementById('realCarImageDisplay');
  const badgeEl = document.getElementById('viewerFinishBadge');
  if (!imgEl) return;

  const vId = state.selectedVehicle ? state.selectedVehicle.id : 'bmw-5';
  const finish = state.selectedPpfFinish || 'gloss_ppf';

  let baseSrc = 'assets/images/bmw_5_gloss.png';
  if (vehicleImages[vId]) {
    baseSrc = vehicleImages[vId][finish] || vehicleImages[vId]['gloss_ppf'] || vehicleImages[vId]['original'];
  } else {
    if (state.selectedCategory === 'SUV') baseSrc = 'assets/images/audi_q5.png';
    else if (state.selectedCategory === 'Sports') baseSrc = 'assets/images/porsche_911.png';
    else baseSrc = 'assets/images/bmw_5_gloss.png';
  }

  // Generate the current frame or view image name
  let imgSrc = baseSrc;
  const view = state.selectedCameraView || '3d';

  if (view !== '3d') {
    const dotIndex = baseSrc.lastIndexOf('.');
    imgSrc = baseSrc.substring(0, dotIndex) + '_' + view + baseSrc.substring(dotIndex);
  } else if (currentFrame > 1) {
    const dotIndex = baseSrc.lastIndexOf('.');
    imgSrc = baseSrc.substring(0, dotIndex) + '_' + currentFrame + baseSrc.substring(dotIndex);
  }

  // Handle image load error by falling back to base image if frame doesn't exist
  imgEl.onerror = function() {
    this.src = baseSrc;
  };

  imgEl.style.opacity = '0.3';
  imgEl.style.transform = 'scale(0.97)';
  setTimeout(() => {
    imgEl.src = imgSrc;
    imgEl.style.opacity = '0.98';
    imgEl.style.transform = 'scale(1.0)';
  }, 50); // Faster update for smooth dragging

  if (badgeEl && state.selectedVehicle) {
    const finishLabel = finish.replace('_', ' ').toUpperCase();
    badgeEl.innerHTML = `<i class="fa-solid fa-car"></i> ${state.selectedVehicle.name} — ${finishLabel}`;
  }
}

// 360 Viewer Drag Logic
function setup360Viewer() {
  const container = document.querySelector('.viewer-container');
  if (!container) return;

  container.addEventListener('mousedown', (e) => {
    isDragging360 = true;
    startX = e.clientX;
    container.style.cursor = 'grabbing';
  });

  window.addEventListener('mouseup', () => {
    isDragging360 = false;
    container.style.cursor = 'grab';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging360) return;
    const deltaX = e.clientX - startX;
    
    // Every 15px dragged changes 1 frame
    if (Math.abs(deltaX) > 15) {
      if (deltaX > 0) {
        currentFrame = currentFrame === 1 ? totalFrames : currentFrame - 1;
      } else {
        currentFrame = currentFrame === totalFrames ? 1 : currentFrame + 1;
      }
      startX = e.clientX; // reset for next frame
      updateRealCarDisplay();
    }
  });

  // Touch support for mobile
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging360 = true;
      startX = e.touches[0].clientX;
    }
  });

  window.addEventListener('touchend', () => {
    isDragging360 = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging360 || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - startX;
    
    if (Math.abs(deltaX) > 15) {
      if (deltaX > 0) {
        currentFrame = currentFrame === 1 ? totalFrames : currentFrame - 1;
      } else {
        currentFrame = currentFrame === totalFrames ? 1 : currentFrame + 1;
      }
      startX = e.touches[0].clientX;
      updateRealCarDisplay();
    }
  });
}

// Save State Helper
function saveState() {
  localStorage.setItem('detailx_state', JSON.stringify(state));
  updateLiveCalculator();
  updateRealCarDisplay();
}

// --- DOM INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Three.js Canvas
  if (window.init3DConfigurator) {
    window.init3DConfigurator();
  }

  // Render Dynamic UI Elements
  renderCategoryTabs();
  renderVehicles();
  renderServiceCards();
  renderCeramicCards();
  setupBeforeAfterSliders();
  setupEventListeners();
  updateLiveCalculator();
  updateRealCarDisplay();
  setup360Viewer(); // Initialize 360 image rotation
  loadSavedGarage();
});

// --- VEHICLE RENDERERS ---
function renderCategoryTabs() {
  const container = document.getElementById('categoryTabs');
  if (!container) return;

  const categories = ['Sedan', 'SUV', 'Luxury', 'Sports'];
  container.innerHTML = categories.map(cat => `
    <button class="cat-tab ${cat === state.selectedCategory ? 'active' : ''}" data-cat="${cat}">
      ${cat}
    </button>
  `).join('');
}

function renderVehicles() {
  const container = document.getElementById('vehicleGrid');
  if (!container) return;

  const filtered = state.vehicles.filter(v => v.category === state.selectedCategory);
  container.innerHTML = filtered.map(v => `
    <div class="vehicle-card ${v.id === state.selectedVehicle.id ? 'selected' : ''}" data-id="${v.id}">
      <div class="vehicle-name">${v.name}</div>
      <div class="vehicle-category">${v.category}</div>
    </div>
  `).join('');
}

// --- SERVICE SELECTION RENDERER ---
function renderServiceCards() {
  const container = document.getElementById('servicesGrid');
  if (!container) return;

  container.innerHTML = state.services.map(s => {
    const isSelected = state.selectedServices.includes(s.id);
    return `
      <div class="service-card ${isSelected ? 'selected' : ''}" data-id="${s.id}">
        <div class="service-card-header">
          <div class="service-icon"><i class="fa-solid ${s.icon}"></i></div>
          <div class="service-checkbox">${isSelected ? '<i class="fa-solid fa-check"></i>' : ''}</div>
        </div>
        <div class="service-title">${s.name}</div>
        <div class="service-desc">${s.desc}</div>
        <div class="service-price">₹${s.price.toLocaleString('en-IN')}</div>
      </div>
    `;
  }).join('');
}

// --- CERAMIC TIER RENDERER ---
function renderCeramicCards() {
  const container = document.getElementById('ceramicGrid');
  if (!container) return;

  container.innerHTML = Object.entries(state.ceramicTiers).map(([key, tier]) => {
    const isSelected = state.selectedCeramicTier === key;
    return `
      <div class="ceramic-card ${isSelected ? 'selected' : ''}" data-tier="${key}">
        <div class="ceramic-years">${tier.duration}</div>
        <div class="service-title">${tier.name}</div>
        <div class="service-price" style="margin-top:0.5rem">₹${tier.price.toLocaleString('en-IN')}</div>
        <ul class="ceramic-features-list">
          <li><i class="fa-solid fa-circle-check"></i> Gloss Index: ${tier.gloss}%</li>
          <li><i class="fa-solid fa-circle-check"></i> 9H Hardness Barrier</li>
          <li><i class="fa-solid fa-circle-check"></i> Hydrophobic Angle: 115°</li>
          <li><i class="fa-solid fa-circle-check"></i> Studio Warranty Included</li>
        </ul>
      </div>
    `;
  }).join('');
}

// --- LIVE PRICE CALCULATOR ENGINE ---
function updateLiveCalculator() {
  const itemList = document.getElementById('calcItemList');
  const vehicleBadge = document.getElementById('calcVehicleBadge');
  const subtotalEl = document.getElementById('calcSubtotal');
  const discountEl = document.getElementById('calcDiscount');
  const taxEl = document.getElementById('calcTax');
  const totalEl = document.getElementById('calcTotal');
  const bottomBarTotal = document.getElementById('mobileBarTotal');

  if (!itemList) return;

  if (vehicleBadge) {
    vehicleBadge.textContent = state.selectedVehicle.name;
  }

  let calculatedItems = [];
  let subtotal = 0;

  // 1. Vehicle Base Multiplier
  if (state.selectedVehicle.basePrice > 0) {
    calculatedItems.push({ name: `${state.selectedVehicle.name} Multiplier`, price: state.selectedVehicle.basePrice });
    subtotal += state.selectedVehicle.basePrice;
  }

  // 2. Selected Services
  state.selectedServices.forEach(servId => {
    const s = state.services.find(item => item.id === servId);
    if (!s) return;

    let itemPrice = s.price;
    // Specific Overrides for Ceramic Coating & PPF
    if (servId === 'ceramic-coating') {
      const tier = state.ceramicTiers[state.selectedCeramicTier];
      if (tier) itemPrice = tier.price;
    } else if (servId === 'ppf') {
      const ppfPrice = state.ppfCoveragePrices[state.selectedPpfCoverage];
      if (ppfPrice) itemPrice = ppfPrice;
    } else if (servId === 'paint-correction') {
      const stage = state.correctionStages[state.selectedCorrectionStage];
      if (stage) itemPrice = stage.price;
    }

    calculatedItems.push({ name: s.name, price: itemPrice });
    subtotal += itemPrice;
  });

  // Tax & Total Math (18% GST)
  const gstTax = Math.round(subtotal * 0.18);
  const finalTotal = subtotal + gstTax;

  // Render Itemized Rows
  itemList.innerHTML = calculatedItems.map(item => `
    <div class="calc-item">
      <span class="calc-item-name">${item.name}</span>
      <span class="calc-item-price">₹${item.price.toLocaleString('en-IN')}</span>
    </div>
  `).join('');

  if (calculatedItems.length === 0) {
    itemList.innerHTML = `<div style="text-align:center; color: var(--text-muted); padding: 1rem;">No protection services selected.</div>`;
  }

  // Update Numbers
  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  if (taxEl) taxEl.textContent = `₹${gstTax.toLocaleString('en-IN')}`;
  if (totalEl) totalEl.textContent = `₹${finalTotal.toLocaleString('en-IN')}`;
  if (bottomBarTotal) bottomBarTotal.textContent = `₹${finalTotal.toLocaleString('en-IN')}`;
}

// --- BEFORE / AFTER DRAGGABLE SLIDERS ---
function setupBeforeAfterSliders() {
  const wrappers = document.querySelectorAll('.before-after-wrapper');
  wrappers.forEach(wrapper => {
    const afterImg = wrapper.querySelector('.ba-after');
    const handle = wrapper.querySelector('.ba-slider-handle');

    if (!afterImg || !handle) return;

    let isDragging = false;

    const moveSlider = (clientX) => {
      const rect = wrapper.getBoundingClientRect();
      let x = clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      const percent = (x / rect.width) * 100;
      afterImg.style.width = `${percent}%`;
      handle.style.left = `${percent}%`;
    };

    handle.addEventListener('mousedown', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', (e) => {
      if (isDragging) moveSlider(e.clientX);
    });

    // Touch support
    handle.addEventListener('touchstart', () => isDragging = true);
    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) moveSlider(e.touches[0].clientX);
    });
  });
}

// --- EVENT LISTENERS setup ---
function setupEventListeners() {
  // Navbar Sticky Scroll Effect
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Theme Toggle (Light / Dark Studio)
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      themeBtn.innerHTML = nextTheme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
      showToast(`Switched to ${nextTheme.toUpperCase()} Studio Theme`);
    });
  }

  // Category Tabs Click
  document.getElementById('categoryTabs')?.addEventListener('click', (e) => {
    const tab = e.target.closest('.cat-tab');
    if (!tab) return;

    state.selectedCategory = tab.dataset.cat;
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Default select first car in category
    const firstVehicle = state.vehicles.find(v => v.category === state.selectedCategory);
    if (firstVehicle) {
      state.selectedVehicle = firstVehicle;
      if (window.buildVehicleGeometry) {
        window.buildVehicleGeometry(state.selectedCategory, 0x111622, state.selectedPpfFinish);
      }
    }

    renderVehicles();
    saveState();
  });

  // Vehicle Card Click
  document.getElementById('vehicleGrid')?.addEventListener('click', (e) => {
    const card = e.target.closest('.vehicle-card');
    if (!card) return;

    const vId = card.dataset.id;
    const found = state.vehicles.find(v => v.id === vId);
    if (found) {
      state.selectedVehicle = found;
      document.querySelectorAll('.vehicle-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      showToast(`${found.name} loaded into 3D viewer`);
      saveState();
    }
  });

  // Service Card Click (Toggle)
  document.getElementById('servicesGrid')?.addEventListener('click', (e) => {
    const card = e.target.closest('.service-card');
    if (!card) return;

    const sId = card.dataset.id;
    if (state.selectedServices.includes(sId)) {
      state.selectedServices = state.selectedServices.filter(id => id !== sId);
      card.classList.remove('selected');
    } else {
      state.selectedServices.push(sId);
      card.classList.add('selected');
      showToast(`Added service to build`);
    }

    renderServiceCards();
    saveState();
  });

  // Color Swatch Picker Click
  document.querySelectorAll('.color-dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      const hex = parseInt(e.target.dataset.color, 16);
      document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
      e.target.classList.add('active');

      if (window.setVehicleColor) {
        window.setVehicleColor(hex);
        showToast('Updated vehicle color in 3D');
      }
    });
  });

  // PPF Finish Switcher Chips
  document.querySelectorAll('.finish-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const finish = e.target.dataset.finish;
      document.querySelectorAll('.finish-chip').forEach(c => c.classList.remove('active'));
      e.target.classList.add('active');
      state.selectedPpfFinish = finish;

      if (window.setVehicleFinish) {
        window.setVehicleFinish(finish);
        showToast(`3D Finish updated: ${finish.replace('_', ' ').toUpperCase()}`);
      }
      saveState();
    });
  });

  // PPF Coverage Chips
  document.querySelectorAll('.coverage-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const cov = e.target.dataset.coverage;
      document.querySelectorAll('.coverage-chip').forEach(c => c.classList.remove('active'));
      e.target.classList.add('active');
      state.selectedPpfCoverage = cov;

      if (!state.selectedServices.includes('ppf')) {
        state.selectedServices.push('ppf');
        renderServiceCards();
      }

      showToast(`PPF Coverage set to ${cov.toUpperCase()}`);
      saveState();
    });
  });

  // Ceramic Coating Tier Click
  document.getElementById('ceramicGrid')?.addEventListener('click', (e) => {
    const card = e.target.closest('.ceramic-card');
    if (!card) return;

    const tier = card.dataset.tier;
    state.selectedCeramicTier = tier;
    document.querySelectorAll('.ceramic-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');

    if (!state.selectedServices.includes('ceramic-coating')) {
      state.selectedServices.push('ceramic-coating');
      renderServiceCards();
    }

    if (window.setCeramicGlossBoost) {
      window.setCeramicGlossBoost(state.ceramicTiers[tier].gloss);
    }

    showToast(`Selected ${state.ceramicTiers[tier].name}`);
    saveState();
  });

  // 3D Camera View Preset Buttons
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const view = e.target.dataset.view;
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      state.selectedCameraView = view;
      if (view === '3d') {
        currentFrame = 1;
      }
      updateRealCarDisplay();

      if (window.setCameraPresetView) {
        window.setCameraPresetView(view);
      }
    });
  });

  // Package Apply Buttons (Silver, Gold, Black)
  document.querySelectorAll('.package-apply-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pkgKey = e.target.dataset.package;
      const pkg = state.packages[pkgKey];
      if (pkg) {
        state.selectedServices = [...pkg.services];
        renderServiceCards();
        saveState();
        showToast(`Loaded ${pkg.name} package into your build!`);

        // Smooth scroll to calculator
        document.getElementById('configurator')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });



  // Booking Modal Triggers
  document.querySelectorAll('.trigger-booking-modal').forEach(btn => {
    btn.addEventListener('click', openBookingModal);
  });

  document.getElementById('modalCloseBtn')?.addEventListener('click', closeBookingModal);

  // Time Slot Chips in Booking Form
  document.getElementById('timeSlotGrid')?.addEventListener('click', (e) => {
    const chip = e.target.closest('.slot-chip');
    if (!chip) return;
    document.querySelectorAll('.slot-chip').forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
  });

  // Submit Appointment Form
  document.getElementById('bookingForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    confirmAppointmentBooking();
  });

  // Admin Portal Triggers
  document.querySelectorAll('.trigger-admin-modal').forEach(btn => {
    btn.addEventListener('click', openAdminModal);
  });
  document.getElementById('adminModalCloseBtn')?.addEventListener('click', closeAdminModal);
}

// --- BOOKING SYSTEM MODAL LOGIC ---
function openBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (!modal) return;

  // Pre-fill form fields
  document.getElementById('bookVehicleSelect').value = state.selectedVehicle.name;
  
  // Update Live Total Preview inside Modal
  const subtotal = calculateCurrentSubtotal();
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;
  document.getElementById('modalTotalPreview').textContent = `Total: ₹${total.toLocaleString('en-IN')}`;

  modal.classList.add('active');
}

function closeBookingModal() {
  document.getElementById('bookingModal')?.classList.remove('active');
}

function confirmAppointmentBooking() {
  const name = document.getElementById('bookName')?.value;
  const phone = document.getElementById('bookPhone')?.value;
  const email = document.getElementById('bookEmail')?.value;
  const date = document.getElementById('bookDate')?.value;
  const selectedSlot = document.querySelector('.slot-chip.selected')?.dataset.slot || '11:30 AM';

  if (!name || !phone || !date) {
    showToast('Please fill all required fields', 'error');
    return;
  }

  const bookingId = `DX-${Math.floor(10000 + Math.random() * 90000)}`;
  const subtotal = calculateCurrentSubtotal();
  const total = subtotal + Math.round(subtotal * 0.18);

  const newBooking = {
    id: bookingId,
    customer: name,
    vehicle: state.selectedVehicle.name,
    service: state.selectedServices.map(sId => state.services.find(s => s.id === sId)?.name).join(', ') || 'Custom Package',
    date: date,
    time: selectedSlot,
    total: total,
    status: 'Confirmed'
  };

  state.bookings.unshift(newBooking);
  saveState();

  closeBookingModal();
  showConfirmationModal(newBooking);
}

function showConfirmationModal(b) {
  const confirmModal = document.getElementById('confirmationModal');
  if (!confirmModal) return;

  document.getElementById('confBookingId').textContent = b.id;
  document.getElementById('confVehicle').textContent = b.vehicle;
  document.getElementById('confDate').textContent = `${b.date} @ ${b.time}`;
  document.getElementById('confTotal').textContent = `₹${b.total.toLocaleString('en-IN')}`;

  confirmModal.classList.add('active');
  document.getElementById('confCloseBtn')?.addEventListener('click', () => {
    confirmModal.classList.remove('active');
  });
}

function calculateCurrentSubtotal() {
  let subtotal = state.selectedVehicle.basePrice;
  state.selectedServices.forEach(sId => {
    const s = state.services.find(item => item.id === sId);
    if (!s) return;
    if (sId === 'ceramic-coating') subtotal += state.ceramicTiers[state.selectedCeramicTier].price;
    else if (sId === 'ppf') subtotal += state.ppfCoveragePrices[state.selectedPpfCoverage];
    else if (sId === 'paint-correction') subtotal += state.correctionStages[state.selectedCorrectionStage].price;
    else subtotal += s.price;
  });
  return subtotal - Math.round((subtotal * state.couponDiscountPct) / 100);
}

// --- 3D GARAGE FEATURE ---
function loadSavedGarage() {
  const garageVehicleName = document.getElementById('garageVehicleName');
  if (garageVehicleName) {
    garageVehicleName.textContent = state.selectedVehicle.name;
  }
}

// --- ADMIN DASHBOARD PORTAL ---
function openAdminModal() {
  const modal = document.getElementById('adminModal');
  if (!modal) return;

  renderAdminPricingTable();
  renderAdminBookingsTable();

  modal.classList.add('active');
}

function closeAdminModal() {
  document.getElementById('adminModal')?.classList.remove('active');
}

function renderAdminPricingTable() {
  const tbody = document.getElementById('adminServicesTbody');
  if (!tbody) return;

  tbody.innerHTML = state.services.map(s => `
    <tr>
      <td><strong>${s.name}</strong></td>
      <td>
        ₹<input type="number" class="admin-price-input" data-id="${s.id}" value="${s.price}" />
      </td>
      <td>
        <button class="btn btn-sm btn-gold save-service-price-btn" data-id="${s.id}">Save</button>
      </td>
    </tr>
  `).join('');

  // Save Event Handlers
  tbody.querySelectorAll('.save-service-price-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const sId = e.target.dataset.id;
      const input = tbody.querySelector(`.admin-price-input[data-id="${sId}"]`);
      if (input) {
        const newPrice = parseInt(input.value, 10);
        const sObj = state.services.find(s => s.id === sId);
        if (sObj && !isNaN(newPrice)) {
          sObj.price = newPrice;
          saveState();
          renderServiceCards();
          showToast(`Updated price for ${sObj.name}`);
        }
      }
    });
  });
}

function renderAdminBookingsTable() {
  const tbody = document.getElementById('adminBookingsTbody');
  if (!tbody) return;

  tbody.innerHTML = state.bookings.map(b => `
    <tr>
      <td><span class="calc-vehicle-badge">${b.id}</span></td>
      <td><strong>${b.customer}</strong></td>
      <td>${b.vehicle}</td>
      <td>${b.date} (${b.time})</td>
      <td style="color:var(--gold-primary); font-weight:700">₹${b.total.toLocaleString('en-IN')}</td>
      <td><span class="gallery-tag">${b.status}</span></td>
    </tr>
  `).join('');
}

// --- TOAST NOTIFICATIONS ENGINE ---
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <i class="fa-solid ${type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-check'}" style="color:${type === 'error' ? '#EF4444' : '#D4AF37'}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Global Exports
window.showToast = showToast;
