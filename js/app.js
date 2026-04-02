// ===== جهاز البنات - Main Application =====

const App = {
  currentView: 'home',
  viewHistory: [],
  selectedPayment: null,
  selectedAvatar: 1,
  shareData: null,

  // ===== Init =====
  init() {
    // Check for share link
    const params = new URLSearchParams(window.location.search);
    if (params.get('share')) {
      try {
        this.shareData = JSON.parse(atob(params.get('share')));
      } catch(e) {}
    }

    // Initialize dark mode from localStorage
    if (localStorage.getItem('jb_dark_mode') === 'true') {
      document.body.classList.add('dark-mode');
    }

    // Set initial language
    document.documentElement.lang = I18N.currentLang;
    document.documentElement.dir = I18N.currentLang === 'ar' ? 'rtl' : 'ltr';

    // Hide splash after animation
    setTimeout(() => {
      document.getElementById('splash').classList.add('fade-out');
      setTimeout(() => {
        document.getElementById('splash').style.display = 'none';
        document.getElementById('app').classList.remove('hidden');
        this.checkAuth();
      }, 500);
    }, 2200);

    this.bindEvents();
    this.updateCartBadge();
    this.updateNotifBadge();
  },

  // ===== Dark Mode =====
  toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('jb_dark_mode', isDark);
    const btn = document.getElementById('btn-dark-toggle');
    if (btn) btn.textContent = isDark ? '☀️' : '🌙';
  },

  // ===== Language Toggle =====
  toggleLanguage() {
    const newLang = I18N.toggle();
    // Re-render current view with new language
    this.render(this.currentView);
    // Update bottom nav labels
    this.updateNavLabels();
    // Show toast
    this.showToast(newLang === 'ar' ? 'تم التغيير إلى العربية' : 'Switched to English');
  },

  updateNavLabels() {
    const navItems = document.querySelectorAll('.nav-item');
    const labels = [I18N.t('home'), I18N.t('wishlist'), I18N.t('donors'), I18N.t('profile')];
    navItems.forEach((btn, i) => {
      const span = btn.querySelector('span');
      if (span && labels[i]) span.textContent = labels[i];
    });
  },

  // ===== Age Gate =====
  showAgeGate() {
    this.openModal(`
      <div class="modal-handle"></div>
      <div style="text-align:center;padding:16px 0">
        <div style="font-size:48px;margin-bottom:16px">🔞</div>
        <h3 class="modal-title">${I18N.t('ageGate')}</h3>
        <div style="display:flex;gap:12px;margin-top:24px">
          <button class="btn btn-primary" style="flex:1" onclick="DB.setAgeVerified();App.closeModal();App.checkAuth()">${I18N.t('yes')}</button>
          <button class="btn btn-secondary" style="flex:1" onclick="App.closeModal();App.showToast(I18N.t('tooYoung'))">${I18N.t('no')}</button>
        </div>
      </div>
    `);
  },

  // ===== Auth Check =====
  checkAuth() {
    if (this.shareData) {
      this.render('shareView');
      return;
    }
    // Age gate check
    if (!DB.ageVerified) {
      this.showAgeGate();
      return;
    }
    if (!DB.currentUser) {
      this.render('auth');
      return;
    }
    this.render('home');
  },

  // ===== Event Bindings =====
  bindEvents() {
    // Bottom Nav
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.navigateTo(view);
      });
    });

    // Cart button
    document.getElementById('btn-cart').addEventListener('click', () => this.navigateTo('cart'));

    // Notifications button
    document.getElementById('btn-notifications').addEventListener('click', () => this.navigateTo('notifications'));

    // Back button
    document.getElementById('btn-back').addEventListener('click', () => this.goBack());

    // Home button
    document.getElementById('btn-home').addEventListener('click', () => this.navigateTo('home'));

    // Modal overlay click
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'modal-overlay') this.closeModal();
    });

    // Dark mode toggle
    document.getElementById('btn-dark-toggle')?.addEventListener('click', () => this.toggleDarkMode());

    // Language toggle
    document.getElementById('btn-lang-toggle')?.addEventListener('click', () => this.toggleLanguage());

    // Set initial dark mode icon
    const dmBtn = document.getElementById('btn-dark-toggle');
    if (dmBtn) dmBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
  },

  // ===== Navigation =====
  navigateTo(view, pushHistory = true) {
    if (pushHistory && this.currentView !== view) {
      this.viewHistory.push(this.currentView);
    }
    this.currentView = view;
    this.render(view);
    
    // Update bottom nav active state
    const navViews = ['home', 'wishlist', 'donors', 'profile'];
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });

    // Show/hide back button
    const showBack = !navViews.includes(view) && view !== 'auth';
    document.getElementById('btn-back').classList.toggle('hidden', !showBack);

    // Show/hide home button (show on all non-home, non-auth pages when logged in)
    const showHome = DB.currentUser && view !== 'home' && view !== 'auth';
    document.getElementById('btn-home').classList.toggle('hidden', !showHome);

    // Show/hide bottom nav
    const showNav = DB.currentUser && navViews.includes(view);
    document.getElementById('bottom-nav').style.display = showNav ? 'flex' : 'none';

    // Show/hide header for auth
    document.getElementById('app-header').style.display = view === 'auth' ? 'none' : '';
  },

  goBack() {
    if (this.viewHistory.length > 0) {
      const prev = this.viewHistory.pop();
      this.navigateTo(prev, false);
    } else {
      this.navigateTo('home', false);
    }
  },

  // ===== Update Badges =====
  updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    const count = DB.cart.length;
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
  },

  updateNotifBadge() {
    const badge = document.getElementById('notif-badge');
    const count = DB.getUnreadCount();
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
  },

  // ===== Toast =====
  showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2500);
  },

  // ===== Modal =====
  openModal(html) {
    document.getElementById('modal-content').innerHTML = html;
    document.getElementById('modal-overlay').classList.remove('hidden');
  },

  closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
  },

  // ===== Render Engine =====
  render(view) {
    const main = document.getElementById('main-content');
    const header = document.getElementById('header-title');
    
    const views = {
      auth: () => { this.renderAuth(); return; },
      home: () => { header.textContent = 'جهاز البنات 💍'; main.innerHTML = this.views.home(); },
      wishlist: () => { header.textContent = 'قائمة أمنياتي 💝'; main.innerHTML = this.views.wishlist(); },
      cart: () => { header.textContent = 'عربة التسوق 🛒'; main.innerHTML = this.views.cart(); },
      donors: () => { header.textContent = 'تبرع لبنت 🤲'; main.innerHTML = this.views.donors(); },
      profile: () => { header.textContent = 'حسابي 👤'; main.innerHTML = this.views.profile(); },
      admin: () => { header.textContent = 'لوحة الإدارة ⚙️'; main.innerHTML = this.views.admin(); },
      products: () => { header.textContent = 'المنتجات 🏷️'; main.innerHTML = this.views.products(); },
      payment: () => { header.textContent = 'الدفع 💳'; main.innerHTML = this.views.payment(); },
      shareLink: () => { header.textContent = 'مشاركة القائمة 🔗'; main.innerHTML = this.views.shareLink(); },
      shareView: () => { header.textContent = 'جهاز البنات 💍'; main.innerHTML = this.views.shareView(); },
      thankYou: () => { header.textContent = 'شكراً لك 🎉'; main.innerHTML = this.views.thankYou(); },
      notifications: () => { header.textContent = 'الإشعارات 🔔'; main.innerHTML = this.views.notifications(); },
      addProduct: () => { header.textContent = 'إضافة منتج ➕'; main.innerHTML = this.views.addProduct(); },
      adminOrders: () => { header.textContent = 'الطلبات 📋'; main.innerHTML = this.views.adminOrders(); },
      privacyPolicy: () => { header.textContent = 'سياسة الخصوصية 🔒'; main.innerHTML = this.views.privacyPolicy(); },
      termsOfUse: () => { header.textContent = 'شروط الاستخدام 📜'; main.innerHTML = this.views.termsOfUse(); },
      aboutUs: () => { header.textContent = 'من نحن ℹ️'; main.innerHTML = this.views.aboutUs(); },
    };

    if (views[view]) views[view]();

    // Bind dynamic events after render
    this.bindDynamicEvents(view);
  },

  // ===== Auth View =====
  renderAuth() {
    document.getElementById('app-header').style.display = 'none';
    document.getElementById('bottom-nav').style.display = 'none';
    
    const L = I18N.t.bind(I18N);
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="auth-screen">
        <div class="auth-logo">💍</div>
        <h1 class="auth-title">${L('appTitle').replace(' 💍','')}</h1>
        <p class="auth-subtitle">${I18N.isAr() ? 'منصة ذكية لهدايا الزواج' : 'Smart platform for wedding gifts'}</p>
        <div class="auth-form">
          <div class="auth-tabs">
            <button class="auth-tab active" data-tab="login">${L('login')}</button>
            <button class="auth-tab" data-tab="register">${L('register')}</button>
          </div>
          <div id="auth-login">
            <div class="form-group">
              <label class="form-label">${L('email')}</label>
              <input type="email" class="form-input" id="login-email" placeholder="example@email.com">
            </div>
            <div class="form-group">
              <label class="form-label">${L('password')}</label>
              <input type="password" class="form-input" id="login-password" placeholder="••••••••">
            </div>
            <div class="forgot-password-link">
              <button onclick="App.renderForgotPassword()">${L('forgotPassword')}</button>
            </div>
            <button class="btn btn-primary btn-block mt-16" id="btn-login">${L('loginBtn')}</button>
          </div>
          <div id="auth-register" class="hidden">
            <div class="form-group">
              <label class="form-label">${L('accountType')}</label>
              <div class="role-selector">
                <div class="role-option selected" data-role="bride">
                  <div class="role-option-icon">👰</div>
                  <div class="role-option-text">${L('bride')}</div>
                </div>
                <div class="role-option" data-role="giver">
                  <div class="role-option-icon">🎁</div>
                  <div class="role-option-text">${L('giver')}</div>
                </div>
                <div class="role-option" data-role="donor">
                  <div class="role-option-icon">🤲</div>
                  <div class="role-option-text">${L('donor')}</div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">${L('fullName')}</label>
              <input type="text" class="form-input" id="reg-name" placeholder="${I18N.isAr() ? 'اسمك الكامل' : 'Your full name'}">
            </div>
            <div class="form-group">
              <label class="form-label">${L('email')}</label>
              <input type="email" class="form-input" id="reg-email" placeholder="example@email.com">
            </div>
            <div class="form-group">
              <label class="form-label">${L('phone')}</label>
              <input type="tel" class="form-input" id="reg-phone" placeholder="01xxxxxxxxx">
            </div>
            <div class="form-group">
              <label class="form-label">${L('password')}</label>
              <input type="password" class="form-input" id="reg-password" placeholder="••••••••">
            </div>
            <div class="terms-check">
              <input type="checkbox" id="reg-terms">
              <label for="reg-terms">${L('acceptTerms')} <a href="#" onclick="event.preventDefault();App.navigateTo('termsOfUse')">${L('termsOfUse')}</a> ${L('and')} <a href="#" onclick="event.preventDefault();App.navigateTo('privacyPolicy')">${L('privacyPolicy')}</a></label>
            </div>
            <button class="btn btn-primary btn-block" id="btn-register">${L('createAccount')}</button>
          </div>
          <div class="auth-footer-links">
            <button onclick="App.navigateTo('privacyPolicy')">${L('privacyPolicy')}</button>
            <span class="sep">|</span>
            <button onclick="App.navigateTo('termsOfUse')">${L('termsOfUse')}</button>
            <span class="sep">|</span>
            <button onclick="App.navigateTo('aboutUs')">${L('aboutUs')}</button>
          </div>
        </div>
      </div>
    `;
    this.bindAuthEvents();
  },

  // ===== Forgot Password View =====
  renderForgotPassword() {
    const L = I18N.t.bind(I18N);
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="auth-screen">
        <div class="auth-logo">🔑</div>
        <h1 class="auth-title">${L('resetPasswordTitle')}</h1>
        <p class="auth-subtitle">${L('resetPasswordMsg')}</p>
        <div class="auth-form">
          <div class="form-group">
            <label class="form-label">${L('email')}</label>
            <input type="email" class="form-input" id="reset-email" placeholder="example@email.com">
          </div>
          <button class="btn btn-primary btn-block" id="btn-reset-password">${L('sendResetLink')}</button>
          <button class="btn btn-secondary btn-block mt-8" onclick="App.renderAuth()">${I18N.isAr() ? 'العودة لتسجيل الدخول' : 'Back to Login'}</button>
        </div>
      </div>
    `;
    document.getElementById('btn-reset-password')?.addEventListener('click', () => {
      const email = document.getElementById('reset-email')?.value?.trim();
      if (!email) return this.showToast(L('enterEmail'));
      if (!email.includes('@')) return this.showToast(L('correctEmail'));
      const result = DB.resetPassword(email);
      if (result.success) {
        this.showToast(L('resetLinkSent'));
        setTimeout(() => this.renderAuth(), 2000);
      } else {
        this.showToast(result.message);
      }
    });
  },

  bindAuthEvents() {
    const L = I18N.t.bind(I18N);
    // Tab switching
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const isLogin = tab.dataset.tab === 'login';
        document.getElementById('auth-login').classList.toggle('hidden', !isLogin);
        document.getElementById('auth-register').classList.toggle('hidden', isLogin);
      });
    });

    // Role selector
    document.querySelectorAll('.role-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.role-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
      });
    });

    // Login
    document.getElementById('btn-login')?.addEventListener('click', () => {
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      if (!email || !password) return this.showToast(L('fillAllFields'));
      const result = DB.login(email, password);
      if (result.success) {
        document.getElementById('app-header').style.display = '';
        this.showToast(L('loginSuccess'));
        this.viewHistory = [];
        this.render('home');
        this.updateCartBadge();
      } else {
        this.showToast(L('invalidCredentials'));
      }
    });

    // Register
    document.getElementById('btn-register')?.addEventListener('click', () => {
      const role = document.querySelector('.role-option.selected')?.dataset.role;
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const phone = document.getElementById('reg-phone').value.trim();
      const password = document.getElementById('reg-password').value;
      const termsAccepted = document.getElementById('reg-terms')?.checked;
      if (!name || !email || !phone || !password) return this.showToast(L('fillAllFields'));
      if (!termsAccepted) return this.showToast(L('acceptTermsFirst'));
      const result = DB.register({ name, email, phone, password, role });
      if (result.success) {
        document.getElementById('app-header').style.display = '';
        this.showToast(L('registerSuccess'));
        this.viewHistory = [];
        this.render('home');
      } else {
        this.showToast(result.message);
      }
    });
  },

  // ===== Dynamic Event Binding =====
  bindDynamicEvents(view) {
    // Product cards - add to cart
    document.querySelectorAll('[data-add-cart]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.addCart);
        const added = DB.addToCart(id);
        if (added) {
          this.updateCartBadge();
          this.showToast('تمت الإضافة للسلة ✓');
          // Animation
          btn.style.transform = 'scale(1.3)';
          setTimeout(() => btn.style.transform = '', 200);
        } else {
          this.showToast('المنتج موجود بالفعل في السلة');
        }
      });
    });

    // Product detail click
    document.querySelectorAll('[data-product-id]').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.productId);
        this.showProductDetail(id);
      });
    });

    // Category pills
    document.querySelectorAll('.cat-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.filterProducts(pill.dataset.category);
      });
    });

    // Cart item remove
    document.querySelectorAll('[data-remove-cart]').forEach(btn => {
      btn.addEventListener('click', () => {
        DB.removeFromCart(parseInt(btn.dataset.removeCart));
        this.updateCartBadge();
        this.render('cart');
      });
    });

    // Payment options
    document.querySelectorAll('.payment-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        this.selectedPayment = opt.dataset.payment;
      });
    });

    // Donor donate button
    document.querySelectorAll('[data-donate-list]').forEach(btn => {
      btn.addEventListener('click', () => {
        const listId = parseInt(btn.dataset.donateList);
        this.showDonorPayment(listId);
      });
    });

    // Avatar selection
    document.querySelectorAll('[data-avatar]').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('[data-avatar]').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        this.selectedAvatar = parseInt(opt.dataset.avatar);
      });
    });
  },

  // ===== Views =====
  views: {
    // ===== Home =====
    home() {
      const categories = ['الكل', 'مطبخ', 'أجهزة', 'غرفة النوم', 'ديكور', 'حمام', 'ملابس'];
      const topProducts = DB.products.slice(0, 6);
      const role = DB.currentUser?.role;
      
      return `
        <div class="page">
          <div class="hero-banner">
            <div class="hero-emoji">💍</div>
            <h2 class="hero-title">جهاز البنات</h2>
            <p class="hero-subtitle">اختاري أمنياتك.. وشاركيها مع من يحبونك</p>
          </div>

          ${role === 'admin' ? `
          <div class="admin-stat-cards">
            <div class="admin-stat-card">
              <div class="admin-stat-num">${DB.products.length}</div>
              <div class="admin-stat-label">المنتجات</div>
            </div>
            <div class="admin-stat-card">
              <div class="admin-stat-num">${DB.orders.length}</div>
              <div class="admin-stat-label">الطلبات</div>
            </div>
            <div class="admin-stat-card">
              <div class="admin-stat-num">${DB.users.length}</div>
              <div class="admin-stat-label">المستخدمين</div>
            </div>
            <div class="admin-stat-card">
              <div class="admin-stat-num">${DB.donorLists.length}</div>
              <div class="admin-stat-label">قوائم التبرع</div>
            </div>
          </div>
          <div class="admin-actions px-16">
            <button class="btn btn-primary btn-sm" onclick="App.navigateTo('addProduct')">➕ إضافة منتج</button>
            <button class="btn btn-secondary btn-sm" onclick="App.navigateTo('adminOrders')">📋 الطلبات</button>
            <button class="btn btn-gold btn-sm" onclick="App.navigateTo('admin')">⚙️ الإدارة</button>
          </div>
          ` : ''}

          <div class="section">
            <div class="section-header">
              <h3 class="section-title">🏷️ التصنيفات</h3>
            </div>
            <div class="cat-pills">
              ${categories.map((cat, i) => `
                <button class="cat-pill ${i === 0 ? 'active' : ''}" data-category="${cat === 'الكل' ? 'all' : cat}">${cat}</button>
              `).join('')}
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <h3 class="section-title">✨ المنتجات المميزة</h3>
              <button class="section-link" onclick="App.navigateTo('products')">عرض الكل</button>
            </div>
            <div class="h-scroll" id="featured-scroll">
              ${topProducts.map(p => App.components.productCard(p)).join('')}
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <h3 class="section-title">🤲 تبرع لبنت يتيمة</h3>
              <button class="section-link" onclick="App.navigateTo('donors')">عرض الكل</button>
            </div>
            <div class="h-scroll">
              ${DB.donorLists.slice(0, 2).map(list => App.components.donorCard(list)).join('')}
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <h3 class="section-title">🛍️ تسوق الآن</h3>
            </div>
            <div class="product-grid" id="product-grid">
              ${topProducts.map(p => App.components.productCardSmall(p)).join('')}
            </div>
          </div>
        </div>
      `;
    },

    // ===== Products Page =====
    products() {
      return `
        <div class="page">
          <div class="cat-pills">
            ${['الكل', 'مطبخ', 'أجهزة', 'غرفة النوم', 'ديكور', 'حمام', 'ملابس'].map((cat, i) => `
              <button class="cat-pill ${i === 0 ? 'active' : ''}" data-category="${cat === 'الكل' ? 'all' : cat}">${cat}</button>
            `).join('')}
          </div>
          <div class="product-grid" id="all-products-grid">
            ${DB.products.map(p => App.components.productCardSmall(p)).join('')}
          </div>
        </div>
      `;
    },

    // ===== Wishlist =====
    wishlist() {
      const myItems = DB.getMyWishlist();
      const inCart = myItems.length > 0 ? myItems : DB.cart;
      
      return `
        <div class="page">
          ${inCart.length === 0 ? `
            <div class="empty-state">
              <div class="empty-icon">💝</div>
              <p class="empty-text">قائمة أمنياتك فارغة</p>
              <p class="empty-text" style="font-size:0.85rem">ابدأ بإضافة المنتجات التي تحلمين بها</p>
              <button class="btn btn-primary mt-16" onclick="App.navigateTo('products')">تسوق الآن</button>
            </div>
          ` : `
            <div class="text-center mb-16">
              <p style="color:var(--text-secondary)">لديك ${inCart.length} منتج في القائمة</p>
            </div>
            ${inCart.map(item => `
              <div class="cart-item">
                <div class="cart-item-img">${item.emoji || '🎁'}</div>
                <div class="cart-item-info">
                  <div class="cart-item-title">${item.name}</div>
                  <div class="cart-item-price">${item.price.toLocaleString()} جنيه</div>
                </div>
                <button class="cart-item-remove" data-remove-cart="${item.id}">✕</button>
              </div>
            `).join('')}
            
            <div class="cart-summary">
              <div class="cart-summary-row total">
                <span>الإجمالي</span>
                <span>${inCart.reduce((s, i) => s + i.price, 0).toLocaleString()} جنيه</span>
              </div>
            </div>

            <div class="px-16">
              <button class="btn btn-primary btn-block mb-8" onclick="App.navigateTo('payment')">💳 الدفع العادي</button>
              <button class="btn btn-gold btn-block" onclick="App.navigateTo('shareLink')">🔗 إنشاء رابط مشاركة</button>
            </div>
          `}
        </div>
      `;
    },

    // ===== Cart =====
    cart() {
      if (DB.cart.length === 0) {
        return `
          <div class="empty-state">
            <div class="empty-icon">🛒</div>
            <p class="empty-text">عربة التسوق فارغة</p>
            <button class="btn btn-primary mt-16" onclick="App.navigateTo('products')">تسوق الآن</button>
          </div>
        `;
      }

      return `
        <div class="page">
          ${DB.cart.map(item => `
            <div class="cart-item">
              <div class="cart-item-img">${item.emoji || '🎁'}</div>
              <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.price.toLocaleString()} جنيه</div>
              </div>
              <button class="cart-item-remove" data-remove-cart="${item.id}">✕</button>
            </div>
          `).join('')}

          <div class="cart-summary">
            <div class="cart-summary-row">
              <span>عدد المنتجات</span>
              <span>${DB.cart.length}</span>
            </div>
            <div class="cart-summary-row">
              <span>رسول التوصيل</span>
              <span>مجاناً</span>
            </div>
            <div class="cart-summary-row total">
              <span>الإجمالي</span>
              <span>${DB.getCartTotal().toLocaleString()} جنيه</span>
            </div>
          </div>

          <div class="px-16">
            <button class="btn btn-primary btn-block mb-8" onclick="App.navigateTo('payment')">متابعة الشراء 💳</button>
            <button class="btn btn-gold btn-block" onclick="App.navigateTo('shareLink')">إنشاء رابط للمجاملين 🔗</button>
          </div>
        </div>
      `;
    },

    // ===== Payment =====
    payment() {
      return `
        <div class="page">
          <div class="section">
            <h3 class="section-title mb-16">اختر طريقة الدفع</h3>
            <div class="payment-options">
              <div class="payment-option" data-payment="instapay">
                <div class="payment-icon">📸</div>
                <div class="payment-info">
                  <div class="payment-name">إنستا باي</div>
                  <div class="payment-desc">تحويل فوري + رفع سكرين شوت</div>
                </div>
                <div class="payment-radio"></div>
              </div>
              <div class="payment-option" data-payment="vodafone">
                <div class="payment-icon">📱</div>
                <div class="payment-info">
                  <div class="payment-name">فودافون كاش</div>
                  <div class="payment-desc">الدفع عبر فودافون كاش</div>
                </div>
                <div class="payment-radio"></div>
              </div>
              <div class="payment-option" data-payment="fawry">
                <div class="payment-icon">🏪</div>
                <div class="payment-info">
                  <div class="payment-name">فوري</div>
                  <div class="payment-desc">الدفع من أقرب نقطة فوري</div>
                </div>
                <div class="payment-radio"></div>
              </div>
              <div class="payment-option" data-payment="paypal">
                <div class="payment-icon">💳</div>
                <div class="payment-info">
                  <div class="payment-name">باي بال</div>
                  <div class="payment-desc">الدفع بالدولار أو الجنيه</div>
                </div>
                <div class="payment-radio"></div>
              </div>
              <div class="payment-option" data-payment="stripe">
                <div class="payment-icon">💎</div>
                <div class="payment-info">
                  <div class="payment-name">بطاقة ائتمان</div>
                  <div class="payment-desc">فيزا أو ماستركارد عبر Stripe</div>
                </div>
                <div class="payment-radio"></div>
              </div>
            </div>
          </div>

          <div class="section px-16">
            <div class="form-group">
              <label class="form-label">عنوان الشحن</label>
              <textarea class="form-textarea" id="shipping-address" placeholder="العنوان الكامل مع رقم الهاتف..."></textarea>
            </div>
          </div>

          <div class="cart-summary mx-16">
            <div class="cart-summary-row total">
              <span>المطلوب دفعه</span>
              <span>${DB.getCartTotal().toLocaleString()} جنيه</span>
            </div>
          </div>

          <div class="section px-16" id="screenshot-section" style="display:none">
            <div class="form-group">
              <label class="form-label">رفع سكرين شوت الدفع</label>
              <div class="upload-zone" id="upload-zone">
                <div class="upload-icon">📷</div>
                <div class="upload-text">اضغط لرفع صورة الدفع</div>
                <input type="file" id="screenshot-input" accept="image/*" style="display:none">
              </div>
              <img id="screenshot-preview" class="upload-preview hidden">
            </div>
          </div>

          <div class="px-16 mb-24">
            <button class="btn btn-success btn-block" id="btn-confirm-payment">تأكيد الدفع ✓</button>
          </div>
        </div>
      `;
    },

    // ===== Share Link =====
    shareLink() {
      const name = DB.currentUser?.name || 'عروسة';
      const avatars = ['👰', '💐', '💍', '🎀', '🌸', '✨'];
      
      return `
        <div class="page">
          <div class="share-preview">
            <p class="mb-8 fw-700">اختر صورة للرابط (اختياري)</p>
            <div class="image-picker-grid">
              ${avatars.map((av, i) => `
                <div class="image-picker-option ${i === 0 ? 'selected' : ''}" data-avatar="${i + 1}">${av}</div>
              `).join('')}
            </div>
          </div>

          <div class="share-preview">
            <div class="share-avatar">${avatars[0]}</div>
            <div class="share-name">${name}</div>
            <div class="share-msg">شاركت قائمة أمنياتها معك 💝</div>
            <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:12px">
              اضغط على المنتجات لدفع ثمنها هدية للعروسة
            </p>
          </div>

          <div class="px-16">
            <button class="btn btn-primary btn-block mb-8" id="btn-generate-link">🔗 إنشاء الرابط</button>
            <button class="btn btn-secondary btn-block" id="btn-copy-link" style="display:none">📋 نسخ الرابط</button>
          </div>

          <div id="share-url-container" class="px-16 mt-16" style="display:none">
            <div class="share-url-box">
              <input type="text" class="share-url-input" id="share-url" readonly>
              <button class="btn btn-primary btn-sm" id="btn-share-copy">نسخ</button>
            </div>
            <p class="text-center mt-8" style="font-size:0.8rem;color:var(--text-secondary)">
              شاركي هذا الرابط في المجموعات العائلية أو على فيسبوك
            </p>
          </div>
        </div>
      `;
    },

    // ===== Share View (Public link recipient) =====
    shareView() {
      if (!App.shareData) return '<div class="empty-state"><p>الرابط غير صالح</p></div>';
      
      const name = App.shareData.name || 'عروسة';
      const avatars = ['👰', '💐', '💍', '🎀', '🌸', '✨'];
      const avatar = avatars[App.shareData.avatar - 1] || avatars[0];
      const items = App.shareData.items.map(id => DB.products.find(p => p.id === id)).filter(Boolean);
      
      return `
        <div class="page">
          <div class="share-preview">
            <div class="share-avatar">${avatar}</div>
            <div class="share-name">${name}</div>
            <div class="share-msg">شاركت قائمة أمنياتها معك 💝</div>
            <p style="font-size:0.9rem;color:var(--text-secondary)">
              اختر المنتجات التي تريد شراؤها هدية للعروسة
            </p>
          </div>

          <div class="section">
            <h3 class="section-title px-16 mb-16">قائمة الأمنيات (${items.length} منتجات)</h3>
            ${items.map(item => `
              <div class="cart-item">
                <div class="cart-item-img">${item.emoji || '🎁'}</div>
                <div class="cart-item-info">
                  <div class="cart-item-title">${item.name}</div>
                  <div class="cart-item-price">${item.price.toLocaleString()} جنيه</div>
                </div>
                <a href="${item.affiliateUrl}" target="_blank" class="btn btn-primary btn-sm">شراء 🛍️</a>
              </div>
            `).join('')}
          </div>

          <div class="section px-16">
            <div class="form-group">
              <label class="form-label">اسمك (المجامل)</label>
              <input type="text" class="form-input" id="giver-name" placeholder="اسمك الكريم">
            </div>
            <div class="form-group">
              <label class="form-label">رفع سكرين شوت الدفع</label>
              <div class="upload-zone" id="giver-upload-zone">
                <div class="upload-icon">📷</div>
                <div class="upload-text">اضغط لرفع صورة الدفع</div>
                <input type="file" id="giver-screenshot" accept="image/*" style="display:none">
              </div>
              <img id="giver-preview" class="upload-preview hidden">
            </div>
          </div>

          <div class="px-16 mb-24">
            <button class="btn btn-success btn-block" id="btn-giver-done">لقد اكتفيت ✓</button>
          </div>
        </div>
      `;
    },

    // ===== Donors =====
    donors() {
      return `
        <div class="page">
          <div class="hero-banner" style="background:linear-gradient(135deg, #f7d774, #e6ac00)">
            <div class="hero-emoji">🤲</div>
            <h2 class="hero-title">تبرع لبنت يتيمة</h2>
            <p class="hero-subtitle">ساهم في تجهيز فتاة تريد البدء حياة جديدة</p>
          </div>

          ${DB.donorLists.map(list => App.components.donorCardFull(list)).join('')}
        </div>
      `;
    },

    // ===== Profile =====
    profile() {
      const user = DB.currentUser;
      if (!user) return '';
      const L = I18N.t.bind(I18N);
      const roleLabels = { bride: L('bride'), giver: L('giver'), donor: L('donor'), admin: L('admin') };
      const roleEmojis = { bride: '👰', giver: '🎁', donor: '🤲', admin: '⚙️' };
      
      return `
        <div class="profile-header">
          <div class="profile-avatar">${roleEmojis[user.role] || '👤'}</div>
          <div class="profile-name">${user.name}</div>
          <div class="profile-role">${roleLabels[user.role] || user.role}</div>
          <div class="profile-stats">
            <div class="profile-stat">
              <div class="profile-stat-num">${DB.cart.length}</div>
              <div class="profile-stat-label">${I18N.isAr() ? 'في السلة' : 'In Cart'}</div>
            </div>
            <div class="profile-stat">
              <div class="profile-stat-num">${DB.orders.filter(o => o.buyerId === user.id).length}</div>
              <div class="profile-stat-label">${I18N.isAr() ? 'طلبات' : 'Orders'}</div>
            </div>
          </div>
        </div>

        <div class="menu-list">
          ${user.role === 'admin' ? `
            <div class="menu-item" onclick="App.navigateTo('admin')">
              <div class="menu-icon">⚙️</div>
              <div class="menu-text">${L('adminPanel')}</div>
              <div class="menu-arrow">‹</div>
            </div>
            <div class="menu-item" onclick="App.navigateTo('addProduct')">
              <div class="menu-icon">➕</div>
              <div class="menu-text">${L('addProduct')}</div>
              <div class="menu-arrow">‹</div>
            </div>
            <div class="menu-item" onclick="App.navigateTo('adminOrders')">
              <div class="menu-icon">📋</div>
              <div class="menu-text">${L('allOrders')}</div>
              <div class="menu-arrow">‹</div>
            </div>
          ` : ''}
          <div class="menu-item" onclick="App.navigateTo('wishlist')">
            <div class="menu-icon">💝</div>
            <div class="menu-text">${L('myWishlistBtn')}</div>
            <div class="menu-arrow">‹</div>
          </div>
          <div class="menu-item" onclick="App.navigateTo('cart')">
            <div class="menu-icon">🛒</div>
            <div class="menu-text">${L('myCart')}</div>
            <div class="menu-arrow">‹</div>
          </div>
          <div class="menu-item" onclick="App.navigateTo('notifications')">
            <div class="menu-icon">🔔</div>
            <div class="menu-text">${L('notifications').replace(' 🔔','')}</div>
            <div class="menu-arrow">‹</div>
          </div>
          <div class="menu-item" onclick="App.toggleDarkMode()">
            <div class="menu-icon">${document.body.classList.contains('dark-mode') ? '☀️' : '🌙'}</div>
            <div class="menu-text">${document.body.classList.contains('dark-mode') ? L('lightMode') : L('darkMode')}</div>
            <div class="menu-arrow">‹</div>
          </div>
          <div class="menu-item" onclick="App.toggleLanguage()">
            <div class="menu-icon">🌐</div>
            <div class="menu-text">${I18N.isAr() ? 'English' : 'العربية'}</div>
            <div class="menu-arrow">‹</div>
          </div>
          <div class="menu-item" onclick="App.navigateTo('privacyPolicy')">
            <div class="menu-icon">🔒</div>
            <div class="menu-text">${L('privacyPolicy')}</div>
            <div class="menu-arrow">‹</div>
          </div>
          <div class="menu-item" onclick="App.navigateTo('termsOfUse')">
            <div class="menu-icon">📜</div>
            <div class="menu-text">${L('termsOfUse')}</div>
            <div class="menu-arrow">‹</div>
          </div>
          <div class="menu-item" onclick="App.navigateTo('aboutUs')">
            <div class="menu-icon">ℹ️</div>
            <div class="menu-text">${L('aboutUs')}</div>
            <div class="menu-arrow">‹</div>
          </div>
          <div class="menu-item" onclick="App.confirmDeleteAccount()">
            <div class="menu-icon">🗑️</div>
            <div class="menu-text text-danger">${L('deleteAccount')}</div>
            <div class="menu-arrow">‹</div>
          </div>
          <div class="menu-item" onclick="App.handleLogout()">
            <div class="menu-icon">🚪</div>
            <div class="menu-text text-danger">${L('logout')}</div>
            <div class="menu-arrow">‹</div>
          </div>
        </div>
      `;
    },

    // ===== Admin =====
    admin() {
      return `
        <div class="page">
          <div class="admin-stat-cards">
            <div class="admin-stat-card">
              <div class="admin-stat-num">${DB.products.length}</div>
              <div class="admin-stat-label">المنتجات</div>
            </div>
            <div class="admin-stat-card">
              <div class="admin-stat-num">${DB.orders.length}</div>
              <div class="admin-stat-label">الطلبات</div>
            </div>
            <div class="admin-stat-card">
              <div class="admin-stat-num">${DB.users.filter(u => u.role === 'bride').length}</div>
              <div class="admin-stat-label">العرائس</div>
            </div>
            <div class="admin-stat-card">
              <div class="admin-stat-num">${DB.users.filter(u => u.role === 'giver').length}</div>
              <div class="admin-stat-label">المجاملين</div>
            </div>
          </div>

          <div class="menu-list">
            <div class="menu-item" onclick="App.navigateTo('addProduct')">
              <div class="menu-icon">➕</div>
              <div class="menu-text">إضافة منتج جديد</div>
              <div class="menu-arrow">‹</div>
            </div>
            <div class="menu-item" onclick="App.navigateTo('adminOrders')">
              <div class="menu-icon">📋</div>
              <div class="menu-text">إدارة الطلبات</div>
              <div class="menu-arrow">‹</div>
            </div>
          </div>

          <div class="section">
            <h3 class="section-title px-16 mb-16">المنتجات (${DB.products.length})</h3>
            ${DB.products.map(p => `
              <div class="cart-item">
                <div class="cart-item-img">${p.emoji || '🎁'}</div>
                <div class="cart-item-info">
                  <div class="cart-item-title">${p.name}</div>
                  <div class="cart-item-price">${p.price.toLocaleString()} جنيه</div>
                </div>
                <button class="cart-item-remove" onclick="DB.removeProduct(${p.id});App.render('admin')">✕</button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    },

    // ===== Add Product (Admin) =====
    addProduct() {
      const emojis = ['🍳','🧺','🛏️','🤖','🍽️','💨','🛁','🏠','🔪','❄️','👗','🪞','📺','🧹','☕','🧴'];
      return `
        <div class="page">
          <div class="px-16">
            <div class="form-group">
              <label class="form-label">اسم المنتج</label>
              <input type="text" class="form-input" id="prod-name" placeholder="مثال: طقم أواني فاخر">
            </div>
            <div class="form-group">
              <label class="form-label">الوصف</label>
              <textarea class="form-textarea" id="prod-desc" placeholder="وصف المنتج..."></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">السعر (جنيه)</label>
              <input type="number" class="form-input" id="prod-price" placeholder="0">
            </div>
            <div class="form-group">
              <label class="form-label">التصنيف</label>
              <select class="form-select" id="prod-category">
                <option value="مطبخ">مطبخ</option>
                <option value="أجهزة">أجهزة</option>
                <option value="غرفة النوم">غرفة النوم</option>
                <option value="ديكور">ديكور</option>
                <option value="حمام">حمام</option>
                <option value="ملابس">ملابس</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">رابط الأفليت</label>
              <input type="url" class="form-input" id="prod-url" placeholder="https://...">
              <input type="url" class="form-input mt-8" id="prod-media" placeholder="رابط صورة أو فيديو (اختياري)">
            </div>
            <div class="form-group">
              <label class="form-label">أيقونة المنتج</label>
              <div class="image-picker-grid">
                ${emojis.map((e, i) => `
                  <div class="image-picker-option ${i === 0 ? 'selected' : ''}" data-emoji="${e}" onclick="document.querySelectorAll('[data-emoji]').forEach(x=>x.classList.remove('selected'));this.classList.add('selected')">${e}</div>
                `).join('')}
              </div>
            </div>
            <button class="btn btn-primary btn-block mt-16" id="btn-add-product">إضافة المنتج ✓</button>
            <button class="btn btn-secondary btn-block mt-8" onclick="App.goBack()">إلغاء</button>
          </div>
        </div>
      `;
    },

    // ===== Admin Orders =====
    adminOrders() {
      if (DB.orders.length === 0) {
        return `<div class="empty-state"><div class="empty-icon">📋</div><p class="empty-text">لا توجد طلبات بعد</p></div>`;
      }
      return `
        <div class="page">
          ${DB.orders.map(order => `
            <div class="order-item">
              <div style="flex:1">
                <div class="fw-700">${order.buyerName || 'مجهول'}</div>
                <div style="font-size:0.8rem;color:var(--text-secondary)">${order.paymentMethod || ''} • ${order.total?.toLocaleString() || 0} جنيه</div>
                <div style="font-size:0.75rem;color:var(--text-light)">${new Date(order.createdAt).toLocaleString('ar-EG')}</div>
              </div>
              <span class="order-status ${order.status}">${order.status === 'pending' ? 'قيد الانتظار' : order.status === 'paid' ? 'مدفوع' : 'مشحون'}</span>
            </div>
          `).join('')}
        </div>
      `;
    },

    // ===== Notifications =====
    notifications() {
      if (DB.notifications.length === 0) {
        return `<div class="empty-state"><div class="empty-icon">🔔</div><p class="empty-text">لا توجد إشعارات</p></div>`;
      }
      DB.markAllRead();
      App.updateNotifBadge();
      return `
        <div class="page">
          ${DB.notifications.map(n => {
            const icon = n.type === 'payment' ? '💰' : n.type === 'donation' ? '🤲' : '🔔';
            const cls = n.type === 'payment' ? 'payment' : n.type === 'donation' ? 'donation' : 'system';
            return `
              <div class="notif-item">
                <div class="notif-icon-wrap ${cls}">${icon}</div>
                <div class="notif-content">
                  <div class="notif-text">${n.text}</div>
                  <div class="notif-time">${App.timeAgo(n.time)}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    },

    // ===== Thank You =====
    thankYou() {
      return `
        <div class="thankyou">
          <div class="thankyou-icon">🎉</div>
          <h2 class="thankyou-title">جزاك الله خيراً!</h2>
          <p style="color:var(--text-secondary);font-size:1rem">
            لقد ساهمت في تجهيز عروسة بقلبك الطيب
          </p>
          <div class="thankyou-dhikr">
            ﴿ وَمَا تُقَدِّمُوا لِأَنفُسِكُم مِّنْ خَيْرٍ تَجِدُوهُ عِندَ اللَّهِ ﴾
            <br><br>
            صدق الله العظيم
          </div>
          <button class="btn btn-primary btn-block" onclick="App.navigateTo('home')">العودة للرئيسية</button>
          <button class="btn btn-secondary btn-block mt-8" onclick="App.navigateTo('donors')">تبرع لبنت أخرى 🤲</button>
        </div>
      `;
    },

    // ===== Privacy Policy =====
    privacyPolicy() {
      return `
        <div class="legal-page">
          <div class="lang-toggle">
            <button class="lang-btn active" onclick="document.getElementById('privacy-ar').style.display='';document.getElementById('privacy-en').style.display='none';this.classList.add('active');this.nextElementSibling.classList.remove('active')">العربية</button>
            <button class="lang-btn" onclick="document.getElementById('privacy-ar').style.display='none';document.getElementById('privacy-en').style.display='';this.classList.add('active');this.previousElementSibling.classList.remove('active')">English</button>
          </div>
          <div id="privacy-ar">
            <h2>🔒 سياسة الخصوصية</h2>
            <p><strong>آخر تحديث:</strong> أبريل 2025</p>
            <p>نحن في تطبيق "جهاز البنات" نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك.</p>
            
            <h3>1. المعلومات التي نجمعها</h3>
            <ul>
              <li>الاسم الكامل والبريد الإلكتروني ورقم الهاتف عند التسجيل</li>
              <li>معلومات الطلبات والعناوين الخاصة بالشحن</li>
              <li>صور إيصالات الدفع التي ترفعها自愿</li>
              <li>قوائم الأمنيات والمنتجات المفضلة</li>
            </ul>

            <h3>2. كيفية استخدام المعلومات</h3>
            <ul>
              <li>توفير خدمات المنصة وإدارة حسابك</li>
              <li>معالجة الطلبات والدفع</li>
              <li>إرسال إشعارات متعلقة بالطلبات والعروض</li>
              <li>تحسين تجربة المستخدم وتطوير التطبيق</li>
            </ul>

            <h3>3. حماية البيانات</h3>
            <p>نستخدم تقنيات تشفير متقدمة لحماية بياناتك. لا نشارك معلوماتك الشخصية مع أي طرف ثالث without موافقتك الصريحة، except when يقتضي ذلك القانون.</p>

            <h3>4. ملفات تعريف الارتباط (Cookies)</h3>
            <p>نستخدم ملفات تعريف الارتباط لتحسين تجربتك وحفظ تفضيلاتك. يمكنك التحكم فيها من خلال إعدادات المتصفح.</p>

            <h3>5. حقوقك</h3>
            <ul>
              <li>الوصول إلى بياناتك الشخصية وتعديلها</li>
              <li>طلب حذف حسابك وبياناتك</li>
              <li>الاعتراض على معالجة بياناتك</li>
              <li>طلب نقل بياناتك</li>
            </ul>

            <h3>6. الخصوصية للأطفال</h3>
            <p>التطبيق مخصص للأشخاص الذين تزيد أعمارهم عن 18 سنة. لا نجمع بيانات من الأطفال intentionally.</p>

            <h3>7. التواصل</h3>
            <p>لأي استفسار regarding الخصوصية، تواصل معنا على: <strong>privacy@jihaz-albanat.com</strong></p>
          </div>
          <div id="privacy-en" style="display:none">
            <h2>🔒 Privacy Policy</h2>
            <p><strong>Last Updated:</strong> April 2025</p>
            <p>At "Jihaz Al-Banat" (Girls' Trousseau), we respect your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and safeguard your information.</p>
            
            <h3>1. Information We Collect</h3>
            <ul>
              <li>Full name, email address, and phone number upon registration</li>
              <li>Order information and shipping addresses</li>
              <li>Payment screenshots you voluntarily upload</li>
              <li>Wishlists and favorite products</li>
            </ul>

            <h3>2. How We Use Your Information</h3>
            <ul>
              <li>Providing platform services and managing your account</li>
              <li>Processing orders and payments</li>
              <li>Sending notifications related to orders and offers</li>
              <li>Improving user experience and developing the app</li>
            </ul>

            <h3>3. Data Protection</h3>
            <p>We use advanced encryption technologies to protect your data. We do not share your personal information with any third party without your explicit consent, unless required by law.</p>

            <h3>4. Cookies</h3>
            <p>We use cookies to improve your experience and save your preferences. You can control them through your browser settings.</p>

            <h3>5. Your Rights</h3>
            <ul>
              <li>Access and modify your personal data</li>
              <li>Request deletion of your account and data</li>
              <li>Object to data processing</li>
              <li>Request data portability</li>
            </ul>

            <h3>6. Children's Privacy</h3>
            <p>The app is intended for users aged 18 and above. We do not intentionally collect data from children.</p>

            <h3>7. Contact Us</h3>
            <p>For privacy-related inquiries, contact us at: <strong>privacy@jihaz-albanat.com</strong></p>
          </div>
        </div>
      `;
    },

    // ===== Terms of Use =====
    termsOfUse() {
      return `
        <div class="legal-page">
          <div class="lang-toggle">
            <button class="lang-btn active" onclick="document.getElementById('terms-ar').style.display='';document.getElementById('terms-en').style.display='none';this.classList.add('active');this.nextElementSibling.classList.remove('active')">العربية</button>
            <button class="lang-btn" onclick="document.getElementById('terms-ar').style.display='none';document.getElementById('terms-en').style.display='';this.classList.add('active');this.previousElementSibling.classList.remove('active')">English</button>
          </div>
          <div id="terms-ar">
            <h2>📜 شروط الاستخدام</h2>
            <p><strong>آخر تحديث:</strong> أبريل 2025</p>
            <p>باستخدامك تطبيق "جهاز البنات"، فإنك توافق على الالتزام بالشروط والأحكام التالية:</p>

            <h3>1. القبول والتسجيل</h3>
            <ul>
              <li>يجب أن يكون عمرك 18 سنة أو أكثر لإنشاء حساب</li>
              <li>يجب تقديم معلومات صحيحة ودقيقة عند التسجيل</li>
              <li>أنت مسؤول عن الحفاظ على سرية بيانات حسابك</li>
              <li>يحق لنا تعليق أو إنهاء الحسابات المخالفة</li>
            </ul>

            <h3>2. الاستخدام المقبول</h3>
            <ul>
              <li>يُمنع استخدام المنصة لأي أغراض غير مشروعة</li>
              <li>يُمنع نشر محتوى مسيء أو مضلل</li>
              <li>يُمنع محاولة اختراق أو تعطيل الخدمة</li>
              <li>يُمنع انتحال هوية الآخرين</li>
            </ul>

            <h3>3. المنتجات والدفع</h3>
            <ul>
              <li>الأسعار المعروضة بالجنيه المصري ما لم يُذكر خلاف ذلك</li>
              <li>روابط المنتجات تؤدي إلى مواقع خارجية (أفليت) ونحن not مسؤولون عن محتواها</li>
              <li>الدفع يتم عبر الطرق المتاحة: إنستا باي، فودافون كاش، فوري، باي بال، أو بطاقة ائتمان</li>
              <li>يجب رفع سكرين شوت الدفع لتأكيد الطلب</li>
            </ul>

            <h3>4. التبرعات</h3>
            <ul>
              <li>التبرعات تذهب مباشرة للفتيات المستفيدات</li>
              <li>لا نفرض أي عمولات على التبرعات</li>
              <li>نحتفظ بالحق في التحقق من هوية المتبرعين والمستفيدات</li>
            </ul>

            <h3>5. الملكية الفكرية</h3>
            <p>جميع حقوق التطبيق والعلامة التجارية والتصميم محفوظة لنا. يُمنع نسخ أو إعادة توزيع أي جزء from without إذن كتابي.</p>

            <h3>6. إخلاء المسؤولية</h3>
            <p>التطبيق يُقدم "كما هو" without أي ضمانات. we are not مسؤولين عن أي أضرار ناتجة about استخدامك للتطبيق.</p>

            <h3>7. تعديل الشروط</h3>
            <p>نحتفظ بالحق في تعديل هذه الشروط في any وقت. سيتم إخطارك بالتغييرات الكبيرة.</p>

            <h3>8. القانون الحاكم</h3>
            <p>تخضع هذه الشروط لقوانين جمهورية مصر العربية ويتم تسوية any نزاع وفقاً لها.</p>
          </div>
          <div id="terms-en" style="display:none">
            <h2>📜 Terms of Use</h2>
            <p><strong>Last Updated:</strong> April 2025</p>
            <p>By using "Jihaz Al-Banat" (Girls' Trousseau) app, you agree to comply with the following terms and conditions:</p>

            <h3>1. Acceptance & Registration</h3>
            <ul>
              <li>You must be 18 years or older to create an account</li>
              <li>You must provide accurate information during registration</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>We reserve the right to suspend or terminate violating accounts</li>
            </ul>

            <h3>2. Acceptable Use</h3>
            <ul>
              <li>The platform must not be used for any illegal purposes</li>
              <li>Posting offensive or misleading content is prohibited</li>
              <li>Attempting to hack or disrupt the service is prohibited</li>
              <li>Impersonating others is prohibited</li>
            </ul>

            <h3>3. Products & Payment</h3>
            <ul>
              <li>Prices are displayed in Egyptian Pounds unless otherwise stated</li>
              <li>Product links lead to external (affiliate) sites; we are not responsible for their content</li>
              <li>Payment via available methods: InstaPay, Vodafone Cash, Fawry, PayPal, or credit card</li>
              <li>A payment screenshot must be uploaded to confirm the order</li>
            </ul>

            <h3>4. Donations</h3>
            <ul>
              <li>Donations go directly to beneficiary girls</li>
              <li>We do not charge any commissions on donations</li>
              <li>We reserve the right to verify the identity of donors and beneficiaries</li>
            </ul>

            <h3>5. Intellectual Property</h3>
            <p>All app rights, trademarks, and designs are reserved. Reproducing or redistributing any part without written permission is prohibited.</p>

            <h3>6. Disclaimer</h3>
            <p>The app is provided "as is" without any warranties. We are not liable for any damages resulting from your use of the app.</p>

            <h3>7. Modifications</h3>
            <p>We reserve the right to modify these terms at any time. You will be notified of significant changes.</p>

            <h3>8. Governing Law</h3>
            <p>These terms are governed by the laws of the Arab Republic of Egypt, and any disputes shall be resolved accordingly.</p>
          </div>
        </div>
      `;
    },

    // ===== About Us =====
    aboutUs() {
      return `
        <div class="legal-page">
          <div class="lang-toggle">
            <button class="lang-btn active" onclick="document.getElementById('about-ar').style.display='';document.getElementById('about-en').style.display='none';this.classList.add('active');this.nextElementSibling.classList.remove('active')">العربية</button>
            <button class="lang-btn" onclick="document.getElementById('about-ar').style.display='none';document.getElementById('about-en').style.display='';this.classList.add('active');this.previousElementSibling.classList.remove('active')">English</button>
          </div>
          <div id="about-ar">
            <h2>ℹ️ من نحن</h2>
            <p>تطبيق <strong>"جهاز البنات"</strong> هو منصة ذكية مصممة لتسهيل عملية تجهيز العرائس وهدايا الزواج بطريقة modern ومنظمة.</p>

            <h3>💡 رؤيتنا</h3>
            <p>نؤمن بأن every عروسة تستحق أن تبدأ حياتها الجديدة مع جهاز كامل. نسعى لربط العرائس بمن يحبونهم ويريدون مساعدتهن.</p>

            <h3>🎯 مهمتنا</h3>
            <ul>
              <li>توفير تجربة تسوق ذكية ومميزة لتجهيز العرائس</li>
              <li>تمكين العرائس من إنشاء قوائم أمنيات ومشاركتها مع亲友</li>
              <li>دعم الفتيات اليتيمات من خلال نظام التبرع المتكامل</li>
              <li>تسهيل عملية الإهداء والمجاملات بين الأهل والأصدقاء</li>
            </ul>

            <h3>✨ ما يميزنا</h3>
            <ul>
              <li>🔗 <strong>روابط المشاركة:</strong> شاركي قائمة أمنياتك مع任何人 عبر رابط واحد</li>
              <li>🤲 <strong>التبرع لليتيمات:</strong> ساهم في تجهيز فتاة يتيمة</li>
              <li>💳 <strong>طرق دفع متنوعة:</strong> إنستا باي، فودافون كاش، فوري، باي بال، بطاقة ائتمان</li>
              <li>📱 <strong>تجربة سلسة:</strong> واجهة سهلة وسريعة تعمل على جميع الأجهزة</li>
            </ul>

            <h3>📞 تواصل معنا</h3>
            <p>البريد الإلكتروني: <strong>support@jihaz-albanat.com</strong></p>
            <p>نسعد بتواصلكم واقتراحاتكم دائماً 💕</p>

            <p style="text-align:center;margin-top:24px;font-size:2rem">💍</p>
            <p style="text-align:center;font-style:italic;color:var(--text-secondary)">جهاز البنات - هدايا الزواج بطريقة ذكية</p>
          </div>
          <div id="about-en" style="display:none">
            <h2>ℹ️ About Us</h2>
            <p><strong>"Jihaz Al-Banat"</strong> (Girls' Trousseau) is a smart platform designed to simplify the process of preparing brides' trousseau and wedding gifts in a modern and organized way.</p>

            <h3>💡 Our Vision</h3>
            <p>We believe every bride deserves to start her new life with a complete trousseau. We strive to connect brides with those who love them and want to help them.</p>

            <h3>🎯 Our Mission</h3>
            <ul>
              <li>Provide a smart and exceptional shopping experience for bridal preparations</li>
              <li>Enable brides to create wishlists and share them with loved ones</li>
              <li>Support orphaned girls through an integrated donation system</li>
              <li>Facilitate gift-giving and generosity among family and friends</li>
            </ul>

            <h3>✨ What Makes Us Special</h3>
            <ul>
              <li>🔗 <strong>Share Links:</strong> Share your wishlist with anyone via a single link</li>
              <li>🤲 <strong>Donate to Orphans:</strong> Help prepare an orphaned girl for her new life</li>
              <li>💳 <strong>Multiple Payment Methods:</strong> InstaPay, Vodafone Cash, Fawry, PayPal, Credit Card</li>
              <li>📱 <strong>Smooth Experience:</strong> Easy and fast interface that works on all devices</li>
            </ul>

            <h3>📞 Contact Us</h3>
            <p>Email: <strong>support@jihaz-albanat.com</strong></p>
            <p>We always welcome your feedback and suggestions 💕</p>

            <p style="text-align:center;margin-top:24px;font-size:2rem">💍</p>
            <p style="text-align:center;font-style:italic;color:var(--text-secondary)">Jihaz Al-Banat - Wedding Gifts, The Smart Way</p>
          </div>
        </div>
      `;
    },
  },

  // ===== Reusable Components =====
  components: {
    productCard(p) {
      return `
        <div class="card" data-product-id="${p.id}">
          <div class="card-img">${p.emoji || '🎁'}</div>
          <div class="card-body">
            <div class="card-title">${p.name}</div>
            <div class="card-desc">${p.desc}</div>
          </div>
          <div class="card-footer">
            <div class="card-price">${p.price.toLocaleString()} <span class="currency">جنيه</span></div>
            <button class="btn-add-cart" data-add-cart="${p.id}" title="أضف للسلة">+</button>
          </div>
        </div>
      `;
    },

    productCardSmall(p) {
      return `
        <div class="card" data-product-id="${p.id}">
          <div class="card-img">${p.emoji || '🎁'}</div>
          <div class="card-body">
            <div class="card-title" style="font-size:0.9rem">${p.name}</div>
            <div class="card-price" style="font-size:0.95rem">${p.price.toLocaleString()} <span class="currency">جنيه</span></div>
          </div>
          <div class="card-footer">
            <span style="font-size:0.75rem;color:var(--text-light)">${p.category}</span>
            <button class="btn-add-cart" data-add-cart="${p.id}" style="width:30px;height:30px;font-size:1rem">+</button>
          </div>
        </div>
      `;
    },

    donorCard(list) {
      const pct = Math.round((list.funded / list.total) * 100);
      return `
        <div class="card" onclick="App.navigateTo('donors')" style="min-width:260px;scroll-snap-align:start">
          <div class="card-body" style="border-right:4px solid var(--accent)">
            <div class="donor-card-header" style="margin-bottom:8px">
              <div class="donor-avatar" style="width:40px;height:40px;font-size:18px">👧</div>
              <div>
                <div class="donor-name" style="font-size:0.9rem">${list.girlName}</div>
                <div class="donor-status">${list.age} سنة</div>
              </div>
            </div>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <div class="progress-text">
              <span>${list.funded.toLocaleString()} / ${list.total.toLocaleString()} جنيه</span>
              <span>${pct}%</span>
            </div>
          </div>
        </div>
      `;
    },

    donorCardFull(list) {
      const pct = Math.round((list.funded / list.total) * 100);
      const items = list.items.map(id => DB.products.find(p => p.id === id)).filter(Boolean);
      return `
        <div class="donor-card">
          <div class="donor-card-header">
            <div class="donor-avatar">👧</div>
            <div>
              <div class="donor-name">${list.girlName}</div>
              <div class="donor-status">${list.age} سنة • ${list.donors} متبرعين</div>
            </div>
          </div>
          <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px">${list.story}</p>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="progress-text">
            <span>${list.funded.toLocaleString()} / ${list.total.toLocaleString()} جنيه</span>
            <span>${pct}%</span>
          </div>
          <div style="margin-top:12px">
            <p style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:8px">المنتجات المطلوبة:</p>
            ${items.map(item => `
              <div style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:0.85rem">
                <span>${item.emoji}</span>
                <span style="flex:1">${item.name}</span>
                <span style="color:var(--primary-dark);font-weight:700">${item.price.toLocaleString()} ج</span>
              </div>
            `).join('')}
          </div>
          <button class="btn btn-gold btn-block mt-16" data-donate-list="${list.id}">تبرع الآن 🤲</button>
        </div>
      `;
    },
  },

  // ===== Handlers =====
  handleLogout() {
    DB.logout();
    document.getElementById('app-header').style.display = 'none';
    document.getElementById('bottom-nav').style.display = 'none';
    this.viewHistory = [];
    this.render('auth');
    this.showToast(I18N.t('logoutSuccess'));
  },

  confirmDeleteAccount() {
    const L = I18N.t.bind(I18N);
    this.openModal(`
      <div class="modal-handle"></div>
      <div style="text-align:center;padding:16px 0">
        <div style="font-size:48px;margin-bottom:16px">⚠️</div>
        <h3 class="modal-title">${L('deleteAccount')}</h3>
        <p style="color:var(--text-secondary);text-align:center;margin-bottom:24px">${L('deleteAccountConfirm')}</p>
        <div style="display:flex;gap:12px">
          <button class="btn btn-danger btn-block" style="background:var(--danger);color:#fff" onclick="DB.deleteAccount();App.closeModal();App.handleLogout();App.showToast(I18N.t('accountDeleted'))">${L('yes')}</button>
          <button class="btn btn-secondary btn-block" onclick="App.closeModal()">${L('cancel')}</button>
        </div>
      </div>
    `);
  },

  handlePayment() {
    const L = I18N.t.bind(I18N);
    if (!this.selectedPayment) return this.showToast(L('selectPaymentFirst'));
    const address = document.getElementById('shipping-address')?.value?.trim();
    if (!address) return this.showToast(L('enterAddress'));

    DB.createOrder({
      buyerId: DB.currentUser?.id,
      buyerName: DB.currentUser?.name,
      items: [...DB.cart],
      total: DB.getCartTotal(),
      paymentMethod: this.selectedPayment,
      shippingAddress: address,
    });

    DB.clearCart();
    this.updateCartBadge();
    this.navigateTo('thankYou');
  },

  handleShareLink() {
    const items = DB.cart.length > 0 ? DB.cart : DB.getMyWishlist();
    if (items.length === 0) return this.showToast(I18N.t('addProductsFirst'));
    
    const link = DB.generateShareLink(items, DB.currentUser?.name || (I18N.isAr() ? 'عروسة' : 'Bride'), this.selectedAvatar);
    const urlInput = document.getElementById('share-url');
    const container = document.getElementById('share-url-container');
    const copyBtn = document.getElementById('btn-copy-link');
    
    if (urlInput) {
      urlInput.value = link;
      container.style.display = '';
      copyBtn.style.display = '';
    }
    this.showToast(I18N.t('linkCreated'));
  },

  handleGiverDone() {
    const name = document.getElementById('giver-name')?.value?.trim();
    DB.createOrder({
      buyerName: name || (I18N.isAr() ? 'مجامل كريم' : 'Kind Gift Giver'),
      items: App.shareData?.items?.map(id => DB.products.find(p => p.id === id)).filter(Boolean) || [],
      total: 0,
      paymentMethod: 'share_link',
      type: 'giver',
    });
    DB.addNotification('payment', `${name || (I18N.isAr() ? 'مجامل' : 'A giver')} ${I18N.isAr() ? 'أهدى هدايا لعروسة' : 'gifted items to a bride'}`);
    this.navigateTo('thankYou');
  },

  showProductDetail(id) {
    const p = DB.products.find(pr => pr.id === id);
    if (!p) return;
    this.openModal(`
      <div class="modal-handle"></div>
      <div style="text-align:center;font-size:64px;margin-bottom:16px">${p.emoji || '🎁'}</div>
      <h3 class="modal-title">${p.name}</h3>
      <p style="color:var(--text-secondary);margin-bottom:16px;text-align:center">${p.desc}</p>
      <p style="text-align:center;font-size:1.4rem;font-weight:900;color:var(--primary-dark);margin-bottom:20px">${p.price.toLocaleString()} جنيه</p>
      <p style="font-size:0.8rem;color:var(--text-light);margin-bottom:12px;text-align:center">التصنيف: ${p.category}</p>
      ${p.mediaUrl ? `<p style="margin-bottom:12px;text-align:center"><a href="${p.mediaUrl}" target="_blank" style="color:var(--primary)">عرض الصورة/الفيديو</a></p>` : ''}
      <div style="display:flex;gap:8px">
        <a href="${p.affiliateUrl}" target="_blank" class="btn btn-secondary" style="flex:1">شراء مباشر 🔗</a>
        <button class="btn btn-primary" style="flex:1" data-add-cart="${p.id}" onclick="App.closeModal()">أضف للسلة 🛒</button>
      </div>
    `);
  },

  showDonorPayment(listId) {
    const list = DB.donorLists.find(l => l.id === listId);
    if (!list) return;
    const remaining = list.total - list.funded;
    this.openModal(`
      <div class="modal-handle"></div>
      <h3 class="modal-title">تبرع لـ ${list.girlName} 🤲</h3>
      <p style="text-align:center;color:var(--text-secondary);margin-bottom:20px">
        المتبقي: ${remaining.toLocaleString()} جنيه
      </p>
      <div class="form-group">
        <label class="form-label">المبلغ (جنيه)</label>
        <input type="number" class="form-input" id="donation-amount" placeholder="0" value="${remaining}">
      </div>
      <div class="form-group">
        <label class="form-label">اسمك (اختياري)</label>
        <input type="text" class="form-input" id="donor-name" placeholder="اسم المتبرع">
      </div>
      <div class="payment-options" style="padding:0">
        <div class="payment-option" data-payment="instapay" onclick="document.querySelectorAll('.payment-option').forEach(x=>x.classList.remove('selected'));this.classList.add('selected')">
          <div class="payment-icon">📸</div>
          <div class="payment-info"><div class="payment-name">إنستا باي</div></div>
          <div class="payment-radio"></div>
        </div>
        <div class="payment-option" data-payment="vodafone" onclick="document.querySelectorAll('.payment-option').forEach(x=>x.classList.remove('selected'));this.classList.add('selected')">
          <div class="payment-icon">📱</div>
          <div class="payment-info"><div class="payment-name">فودافون كاش</div></div>
          <div class="payment-radio"></div>
        </div>
        <div class="payment-option" data-payment="paypal" onclick="document.querySelectorAll('.payment-option').forEach(x=>x.classList.remove('selected'));this.classList.add('selected')">
          <div class="payment-icon">💳</div>
          <div class="payment-info"><div class="payment-name">باي بال</div></div>
          <div class="payment-radio"></div>
        </div>
      </div>
      <button class="btn btn-gold btn-block mt-24" onclick="App.processDonation(${listId})">تأكيد التبرع 💛</button>
    `);
  },

  processDonation(listId) {
    const amount = parseInt(document.getElementById('donation-amount')?.value) || 0;
    if (amount <= 0) return this.showToast(I18N.t('enterValidAmount'));
    
    const list = DB.donorLists.find(l => l.id === listId);
    if (list) {
      list.funded = Math.min(list.funded + amount, list.total);
      list.donors++;
      DB.save('donorLists');
    }
    
    const donorName = document.getElementById('donor-name')?.value?.trim() || (I18N.isAr() ? 'متبرع كريم' : 'Generous Donor');
    DB.addNotification('donation', `${donorName} ${I18N.isAr() ? 'تبرع بـ' : 'donated'} ${amount.toLocaleString()} ${I18N.isAr() ? 'جنيه لـ' : 'EGP to'} ${list.girlName}`);
    
    this.closeModal();
    this.render('donors');
    this.showToast(I18N.t('donationSuccess'));
  },

  // ===== Utility =====
  timeAgo(ts) {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'الآن';
    if (mins < 60) return `منذ ${mins} دقيقة`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `منذ ${hrs} ساعة`;
    const days = Math.floor(hrs / 24);
    return `منذ ${days} يوم`;
  },

  filterProducts(category) {
    const grid = document.getElementById('product-grid') || document.getElementById('all-products-grid') || document.getElementById('featured-scroll');
    if (!grid) return;
    
    const filtered = category === 'all' ? DB.products : DB.products.filter(p => p.category === category);
    const isScroll = grid.id === 'featured-scroll';
    
    if (isScroll) {
      grid.innerHTML = filtered.map(p => App.components.productCard(p)).join('');
    } else {
      grid.innerHTML = filtered.map(p => App.components.productCardSmall(p)).join('');
    }
    this.bindDynamicEvents('products');
  },
};

// ===== Post-Render Dynamic Bindings =====
// Re-bind after render
const originalRender = App.render.bind(App);
App.render = function(view) {
  originalRender(view);
  
  // Bind add-product button
  document.getElementById('btn-add-product')?.addEventListener('click', () => {
    const name = document.getElementById('prod-name')?.value?.trim();
    const desc = document.getElementById('prod-desc')?.value?.trim();
    const price = parseInt(document.getElementById('prod-price')?.value) || 0;
    const category = document.getElementById('prod-category')?.value;
    const url = document.getElementById('prod-url')?.value?.trim();
    const media = document.getElementById('prod-media')?.value?.trim();
    const emoji = document.querySelector('[data-emoji].selected')?.dataset.emoji || '🎁';
    
    if (!name || !price || !url) return App.showToast('يرجى ملء الحقول المطلوبة');
    
    DB.addProduct({ name, desc, price, category, affiliateUrl: url, mediaUrl: media, emoji });
    App.showToast('تمت إضافة المنتج ✓');
    App.navigateTo('admin');
  });

  // Bind payment confirm
  document.getElementById('btn-confirm-payment')?.addEventListener('click', () => App.handlePayment());

  // Bind share link
  document.getElementById('btn-generate-link')?.addEventListener('click', () => App.handleShareLink());
  document.getElementById('btn-copy-link')?.addEventListener('click', () => {
    const input = document.getElementById('share-url');
    if (input?.value) {
      navigator.clipboard?.writeText(input.value);
      App.showToast('تم نسخ الرابط ✓');
    }
  });
  document.getElementById('btn-share-copy')?.addEventListener('click', () => {
    const input = document.getElementById('share-url');
    if (input?.value) {
      navigator.clipboard?.writeText(input.value);
      App.showToast('تم نسخ الرابط ✓');
    }
  });

  // Bind giver done
  document.getElementById('btn-giver-done')?.addEventListener('click', () => App.handleGiverDone());

  // Bind screenshot upload
  document.getElementById('upload-zone')?.addEventListener('click', () => {
    document.getElementById('screenshot-input')?.click();
  });
  document.getElementById('screenshot-input')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const preview = document.getElementById('screenshot-preview');
        if (preview) {
          preview.src = ev.target.result;
          preview.classList.remove('hidden');
        }
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('giver-upload-zone')?.addEventListener('click', () => {
    document.getElementById('giver-screenshot')?.click();
  });
  document.getElementById('giver-screenshot')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const preview = document.getElementById('giver-preview');
        if (preview) {
          preview.src = ev.target.result;
          preview.classList.remove('hidden');
        }
      };
      reader.readAsDataURL(file);
    }
  });

  // Show/hide screenshot section based on payment method
  document.querySelectorAll('.payment-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const section = document.getElementById('screenshot-section');
      if (section) section.style.display = '';
    });
  });
};

// ===== Start =====
document.addEventListener('DOMContentLoaded', () => App.init());

// ===== Service Worker Registration =====
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
