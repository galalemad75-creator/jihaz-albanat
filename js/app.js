// ===== جهاز البنات - Main Application =====

const App = {
  currentView: 'home',
  viewHistory: [],
  selectedPayment: null,
  selectedAvatar: 1,
  shareData: null,

  // Shortcut
  get L() { return I18N.t.bind(I18N); },
  get ar() { return I18N.isAr(); },

  // ===== Init =====
  init() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('share')) {
      try { this.shareData = JSON.parse(atob(params.get('share'))); } catch(e) {}
    }

    if (localStorage.getItem('jb_dark_mode') === 'true') {
      document.body.classList.add('dark-mode');
    }

    document.documentElement.lang = I18N.currentLang;
    document.documentElement.dir = I18N.currentLang === 'ar' ? 'rtl' : 'ltr';

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
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    this.render(this.currentView);
    this.updateNavLabels();
    // Show correct header
    if (this.currentView !== 'auth') {
      document.getElementById('app-header').style.display = '';
    }
    this.showToast(newLang === 'ar' ? 'تم التغيير إلى العربية 🇪🇬' : 'Switched to English 🇬🇧');
  },

  updateNavLabels() {
    const navItems = document.querySelectorAll('.nav-item');
    const labels = [this.L('home'), this.L('wishlist'), this.L('donors'), this.L('profile')];
    navItems.forEach((btn, i) => {
      const span = btn.querySelector('span');
      if (span && labels[i]) span.textContent = labels[i];
    });
  },

  // ===== Auth Check =====
  checkAuth() {
    if (this.shareData) {
      document.getElementById('app-header').style.display = '';
      this.render('shareView');
      return;
    }
    // Always show auth if no user
    if (!DB.currentUser) {
      this.viewHistory = []; // Clear history to prevent bypass
      this.render('auth');
      return;
    }
    document.getElementById('app-header').style.display = '';
    this.viewHistory = [];
    this.render('home');
  },

  // ===== Event Bindings =====
  bindEvents() {
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.navigateTo(view);
      });
    });

    document.getElementById('btn-cart').addEventListener('click', () => this.navigateTo('cart'));
    document.getElementById('btn-notifications').addEventListener('click', () => this.navigateTo('notifications'));
    document.getElementById('btn-back').addEventListener('click', () => this.goBack());
    document.getElementById('btn-home').addEventListener('click', () => this.navigateTo('home'));

    document.getElementById('modal-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'modal-overlay') this.closeModal();
    });

    document.getElementById('btn-dark-toggle')?.addEventListener('click', () => this.toggleDarkMode());
    document.getElementById('btn-lang-toggle')?.addEventListener('click', () => this.toggleLanguage());

    const dmBtn = document.getElementById('btn-dark-toggle');
    if (dmBtn) dmBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
  },

  // ===== Navigation =====
  navigateTo(view, pushHistory = true) {
    // SECURITY: Block access to app pages if not logged in
    const publicViews = ['auth', 'privacyPolicy', 'termsOfUse', 'aboutUs', 'shareView', 'forgotPassword'];
    if (!DB.currentUser && !publicViews.includes(view)) {
      this.render('auth');
      return;
    }

    if (pushHistory && this.currentView !== view) {
      this.viewHistory.push(this.currentView);
    }
    this.currentView = view;
    this.render(view);

    const navViews = ['home', 'wishlist', 'donors', 'profile'];
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });

    // Back button: show on all non-nav, non-auth pages
    const showBack = !navViews.includes(view) && view !== 'auth';
    document.getElementById('btn-back').classList.toggle('hidden', !showBack);

    // Home button: show ONLY when logged in AND not on home
    const showHome = !!DB.currentUser && view !== 'home';
    document.getElementById('btn-home').classList.toggle('hidden', !showHome);

    // Bottom nav
    const showNav = !!DB.currentUser && navViews.includes(view);
    document.getElementById('bottom-nav').style.display = showNav ? 'flex' : 'none';

    // Header
    document.getElementById('app-header').style.display = view === 'auth' ? 'none' : '';
  },

  goBack() {
    // If not logged in, always go back to auth (never into the app)
    if (!DB.currentUser) {
      this.viewHistory = [];
      this.render('auth');
      return;
    }
    if (this.viewHistory.length > 0) {
      const prev = this.viewHistory.pop();
      // Safety: if prev is somehow a non-public view and user not logged in, go to auth
      if (!DB.currentUser && !['auth','privacyPolicy','termsOfUse','aboutUs'].includes(prev)) {
        this.render('auth');
        return;
      }
      this.navigateTo(prev, false);
    } else {
      this.navigateTo('home', false);
    }
  },

  // ===== Badges =====
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

  // ===== Toast & Modal =====
  showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2500);
  },
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
    const T = this.L;

    const viewMap = {
      auth:         () => { this.renderAuth(); },
      home:         () => { header.textContent = T('appTitle'); main.innerHTML = this.views.home(); },
      wishlist:     () => { header.textContent = T('myWishlist'); main.innerHTML = this.views.wishlist(); },
      cart:         () => { header.textContent = T('cart'); main.innerHTML = this.views.cart(); },
      donors:       () => { header.textContent = (this.ar ? 'تبرع لبنت 🤲' : 'Donate 🤲'); main.innerHTML = this.views.donors(); },
      profile:      () => { header.textContent = (this.ar ? 'حسابي 👤' : 'Profile 👤'); main.innerHTML = this.views.profile(); },
      admin:        () => { header.textContent = (this.ar ? 'لوحة الإدارة ⚙️' : 'Admin Panel ⚙️'); main.innerHTML = this.views.admin(); },
      products:     () => { header.textContent = T('products') + ' 🏷️'; main.innerHTML = this.views.products(); },
      payment:      () => { header.textContent = (this.ar ? 'الدفع 💳' : 'Payment 💳'); main.innerHTML = this.views.payment(); },
      shareLink:    () => { header.textContent = (this.ar ? 'مشاركة القائمة 🔗' : 'Share Link 🔗'); main.innerHTML = this.views.shareLink(); },
      shareView:    () => { header.textContent = T('appTitle'); main.innerHTML = this.views.shareView(); },
      thankYou:     () => { header.textContent = (this.ar ? 'شكراً لك 🎉' : 'Thank You 🎉'); main.innerHTML = this.views.thankYou(); },
      notifications:() => { header.textContent = T('notifications'); main.innerHTML = this.views.notifications(); },
      addProduct:   () => { header.textContent = (this.ar ? 'إضافة منتج ➕' : 'Add Product ➕'); main.innerHTML = this.views.addProduct(); },
      adminOrders:  () => { header.textContent = (this.ar ? 'الطلبات 📋' : 'Orders 📋'); main.innerHTML = this.views.adminOrders(); },
      privacyPolicy:() => { header.textContent = T('privacyPolicy'); main.innerHTML = this.views.privacyPolicy(); },
      termsOfUse:   () => { header.textContent = T('termsOfUse'); main.innerHTML = this.views.termsOfUse(); },
      aboutUs:      () => { header.textContent = T('aboutUs'); main.innerHTML = this.views.aboutUs(); },
    };

    if (viewMap[view]) viewMap[view]();
    this.bindDynamicEvents(view);
  },

  // ===== Auth View =====
  renderAuth() {
    document.getElementById('app-header').style.display = 'none';
    document.getElementById('bottom-nav').style.display = 'none';
    const T = this.L, ar = this.ar;
    const main = document.getElementById('main-content');

    main.innerHTML = `
      <div class="auth-screen">
        <div class="auth-logo">💍</div>
        <h1 class="auth-title">${ar ? 'جهاز البنات' : 'Jihaz Al-Banat'}</h1>
        <p class="auth-subtitle">${ar ? 'منصة ذكية لهدايا الزواج' : 'Smart platform for wedding gifts'}</p>
        <div class="auth-form">
          <div class="auth-tabs">
            <button class="auth-tab active" data-tab="login">${T('login')}</button>
            <button class="auth-tab" data-tab="register">${T('register')}</button>
          </div>
          <div id="auth-login">
            <div class="form-group">
              <label class="form-label">${T('email')}</label>
              <input type="email" class="form-input" id="login-email" placeholder="example@email.com">
            </div>
            <div class="form-group">
              <label class="form-label">${T('password')}</label>
              <input type="password" class="form-input" id="login-password" placeholder="••••••••">
            </div>
            <div class="forgot-password-link">
              <button onclick="App.renderForgotPassword()">${T('forgotPassword')}</button>
            </div>
            <button class="btn btn-primary btn-block mt-16" id="btn-login">${T('loginBtn')}</button>
          </div>
          <div id="auth-register" class="hidden">
            <div class="form-group">
              <label class="form-label">${T('accountType')}</label>
              <div class="role-selector">
                <div class="role-option selected" data-role="bride">
                  <div class="role-option-icon">👰</div>
                  <div class="role-option-text">${T('bride')}</div>
                </div>
                <div class="role-option" data-role="giver">
                  <div class="role-option-icon">🎁</div>
                  <div class="role-option-text">${T('giver')}</div>
                </div>
                <div class="role-option" data-role="donor">
                  <div class="role-option-icon">🤲</div>
                  <div class="role-option-text">${T('donor')}</div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">${T('fullName')}</label>
              <input type="text" class="form-input" id="reg-name" placeholder="${ar ? 'اسمك الكامل' : 'Your full name'}">
            </div>
            <div class="form-group">
              <label class="form-label">${T('email')}</label>
              <input type="email" class="form-input" id="reg-email" placeholder="example@email.com">
            </div>
            <div class="form-group">
              <label class="form-label">${T('phone')}</label>
              <input type="tel" class="form-input" id="reg-phone" placeholder="01xxxxxxxxx">
            </div>
            <div class="form-group">
              <label class="form-label">${T('password')}</label>
              <input type="password" class="form-input" id="reg-password" placeholder="••••••••">
            </div>
            <div class="form-group">
              <label class="form-label">${ar ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
              <input type="password" class="form-input" id="reg-password2" placeholder="••••••••">
            </div>
            <div class="terms-check">
              <input type="checkbox" id="reg-terms">
              <label for="reg-terms">${T('acceptTerms')} <a href="#" onclick="event.preventDefault();App.navigateTo('termsOfUse')">${T('termsOfUse')}</a> ${T('and')} <a href="#" onclick="event.preventDefault();App.navigateTo('privacyPolicy')">${T('privacyPolicy')}</a></label>
            </div>
            <button class="btn btn-primary btn-block" id="btn-register">${T('createAccount')}</button>
          </div>
          <div class="auth-footer-links">
            <button onclick="App.navigateTo('privacyPolicy')">${T('privacyPolicy')}</button>
            <span class="sep">|</span>
            <button onclick="App.navigateTo('termsOfUse')">${T('termsOfUse')}</button>
            <span class="sep">|</span>
            <button onclick="App.navigateTo('aboutUs')">${T('aboutUs')}</button>
          </div>
        </div>
      </div>
    `;
    this.bindAuthEvents();
  },

  // ===== Forgot Password =====
  renderForgotPassword() {
    const T = this.L, ar = this.ar;
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="auth-screen">
        <div class="auth-logo">🔑</div>
        <h1 class="auth-title">${T('resetPasswordTitle')}</h1>
        <p class="auth-subtitle">${T('resetPasswordMsg')}</p>
        <div class="auth-form">
          <div class="form-group">
            <label class="form-label">${T('email')}</label>
            <input type="email" class="form-input" id="reset-email" placeholder="example@email.com">
          </div>
          <button class="btn btn-primary btn-block" id="btn-reset-password">${T('sendResetLink')}</button>
          <button class="btn btn-secondary btn-block mt-8" onclick="App.renderAuth()">${ar ? 'العودة لتسجيل الدخول' : 'Back to Login'}</button>
        </div>
      </div>
    `;
    document.getElementById('btn-reset-password')?.addEventListener('click', () => {
      const email = document.getElementById('reset-email')?.value?.trim();
      if (!email) return this.showToast(T('enterEmail'));
      if (!email.includes('@')) return this.showToast(T('correctEmail'));
      const result = DB.resetPassword(email);
      if (result.success) {
        this.showToast(T('resetLinkSent'));
        setTimeout(() => this.renderAuth(), 2000);
      } else {
        this.showToast(result.message);
      }
    });
  },

  // ===== Auth Events =====
  bindAuthEvents() {
    const T = this.L;
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const isLogin = tab.dataset.tab === 'login';
        document.getElementById('auth-login').classList.toggle('hidden', !isLogin);
        document.getElementById('auth-register').classList.toggle('hidden', isLogin);
      });
    });

    document.querySelectorAll('.role-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.role-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
      });
    });

    document.getElementById('btn-login')?.addEventListener('click', () => {
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      if (!email || !password) return this.showToast(T('fillAllFields'));
      const result = DB.login(email, password);
      if (result.success) {
        document.getElementById('app-header').style.display = '';
        this.showToast(T('loginSuccess'));
        this.viewHistory = [];
        this.render('home');
        this.updateCartBadge();
      } else {
        this.showToast(T('invalidCredentials'));
      }
    });

    document.getElementById('btn-register')?.addEventListener('click', () => {
      const role = document.querySelector('.role-option.selected')?.dataset.role;
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const phone = document.getElementById('reg-phone').value.trim();
      const password = document.getElementById('reg-password').value;
      const password2 = document.getElementById('reg-password2').value;
      const termsAccepted = document.getElementById('reg-terms')?.checked;
      if (!name || !email || !phone || !password) return this.showToast(T('fillAllFields'));
      if (password !== password2) return this.showToast(this.ar ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
      if (!termsAccepted) return this.showToast(T('acceptTermsFirst'));
      const result = DB.register({ name, email, phone, password, role });
      if (result.success) {
        document.getElementById('app-header').style.display = '';
        this.showToast(T('registerSuccess'));
        this.viewHistory = [];
        this.render('home');
      } else {
        this.showToast(result.message);
      }
    });
  },

  // ===== Dynamic Events =====
  bindDynamicEvents(view) {
    const T = this.L;
    document.querySelectorAll('[data-add-cart]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.addCart);
        const added = DB.addToCart(id);
        if (added) {
          this.updateCartBadge();
          this.showToast(T('addedToCart'));
          btn.style.transform = 'scale(1.3)';
          setTimeout(() => btn.style.transform = '', 200);
        } else {
          this.showToast(T('alreadyInCart'));
        }
      });
    });

    document.querySelectorAll('[data-product-id]').forEach(card => {
      card.addEventListener('click', () => this.showProductDetail(parseInt(card.dataset.productId)));
    });

    document.querySelectorAll('.cat-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.filterProducts(pill.dataset.category);
      });
    });

    document.querySelectorAll('[data-remove-cart]').forEach(btn => {
      btn.addEventListener('click', () => {
        DB.removeFromCart(parseInt(btn.dataset.removeCart));
        this.updateCartBadge();
        this.render(this.currentView);
      });
    });

    document.querySelectorAll('.payment-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        this.selectedPayment = opt.dataset.payment;
        const section = document.getElementById('screenshot-section');
        if (section) section.style.display = '';
      });
    });

    document.querySelectorAll('[data-donate-list]').forEach(btn => {
      btn.addEventListener('click', () => this.showDonorPayment(parseInt(btn.dataset.donateList)));
    });

    document.querySelectorAll('[data-avatar]').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('[data-avatar]').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        this.selectedAvatar = parseInt(opt.dataset.avatar);
      });
    });

    // Add product
    document.getElementById('btn-add-product')?.addEventListener('click', () => {
      const name = document.getElementById('prod-name')?.value?.trim();
      const desc = document.getElementById('prod-desc')?.value?.trim();
      const price = parseInt(document.getElementById('prod-price')?.value) || 0;
      const category = document.getElementById('prod-category')?.value;
      const url = document.getElementById('prod-url')?.value?.trim();
      const media = document.getElementById('prod-media')?.value?.trim();
      const emoji = document.querySelector('[data-emoji].selected')?.dataset.emoji || '🎁';
      if (!name || !price || !url) return this.showToast(T('fillAllFields'));
      DB.addProduct({ name, desc, price, category, affiliateUrl: url, mediaUrl: media, emoji });
      this.showToast(this.ar ? 'تمت إضافة المنتج ✓' : 'Product added ✓');
      this.navigateTo('admin');
    });

    // Payment confirm
    document.getElementById('btn-confirm-payment')?.addEventListener('click', () => this.handlePayment());

    // Share link
    document.getElementById('btn-generate-link')?.addEventListener('click', () => this.handleShareLink());
    const copyHandler = () => {
      const input = document.getElementById('share-url');
      if (input?.value) { navigator.clipboard?.writeText(input.value); this.showToast(T('linkCopied')); }
    };
    document.getElementById('btn-copy-link')?.addEventListener('click', copyHandler);
    document.getElementById('btn-share-copy')?.addEventListener('click', copyHandler);

    // Giver done
    document.getElementById('btn-giver-done')?.addEventListener('click', () => this.handleGiverDone());

    // Upload zones
    document.getElementById('upload-zone')?.addEventListener('click', () => document.getElementById('screenshot-input')?.click());
    document.getElementById('screenshot-input')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) { const r = new FileReader(); r.onload = (ev) => { const p = document.getElementById('screenshot-preview'); p.src = ev.target.result; p.classList.remove('hidden'); }; r.readAsDataURL(file); }
    });
    document.getElementById('giver-upload-zone')?.addEventListener('click', () => document.getElementById('giver-screenshot')?.click());
    document.getElementById('giver-screenshot')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) { const r = new FileReader(); r.onload = (ev) => { const p = document.getElementById('giver-preview'); p.src = ev.target.result; p.classList.remove('hidden'); }; r.readAsDataURL(file); }
    });
  },

  // ===== Views =====
  views: {
    home() {
      const ar = App.ar, T = App.L;
      const catKeys = ['all','kitchen','appliances','bedroom','decor','bathroom','clothes'];
      const catLabels = [T('all'), T('kitchen'), T('appliances'), T('bedroom'), T('decor'), T('bathroom'), T('clothes')];
      const catValues = ['all','مطبخ','أجهزة','غرفة النوم','ديكور','حمام','ملابس'];
      const topProducts = DB.products.slice(0, 6);
      const role = DB.currentUser?.role;

      return `
        <div class="page">
          <div class="hero-banner">
            <div class="hero-emoji">💍</div>
            <h2 class="hero-title">${ar ? 'جهاز البنات' : 'Jihaz Al-Banat'}</h2>
            <p class="hero-subtitle">${ar ? 'اختاري أمنياتك.. وشاركيها مع من يحبونك' : 'Choose your wishes.. share with loved ones'}</p>
          </div>

          ${role === 'admin' ? `
          <div class="admin-stat-cards">
            <div class="admin-stat-card"><div class="admin-stat-num">${DB.products.length}</div><div class="admin-stat-label">${ar ? 'المنتجات' : 'Products'}</div></div>
            <div class="admin-stat-card"><div class="admin-stat-num">${DB.orders.length}</div><div class="admin-stat-label">${ar ? 'الطلبات' : 'Orders'}</div></div>
            <div class="admin-stat-card"><div class="admin-stat-num">${DB.users.length}</div><div class="admin-stat-label">${ar ? 'المستخدمين' : 'Users'}</div></div>
            <div class="admin-stat-card"><div class="admin-stat-num">${DB.donorLists.length}</div><div class="admin-stat-label">${ar ? 'قوائم التبرع' : 'Donor Lists'}</div></div>
          </div>
          <div class="admin-actions px-16">
            <button class="btn btn-primary btn-sm" onclick="App.navigateTo('addProduct')">➕ ${T('addProduct')}</button>
            <button class="btn btn-secondary btn-sm" onclick="App.navigateTo('adminOrders')">📋 ${ar ? 'الطلبات' : 'Orders'}</button>
            <button class="btn btn-gold btn-sm" onclick="App.navigateTo('admin')">⚙️ ${ar ? 'الإدارة' : 'Admin'}</button>
          </div>` : ''}

          <div class="section">
            <div class="section-header"><h3 class="section-title">🏷️ ${T('categories')}</h3></div>
            <div class="cat-pills">
              ${catLabels.map((cat, i) => `<button class="cat-pill ${i === 0 ? 'active' : ''}" data-category="${catValues[i]}">${cat}</button>`).join('')}
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <h3 class="section-title">✨ ${T('featuredProducts')}</h3>
              <button class="section-link" onclick="App.navigateTo('products')">${T('viewAll')}</button>
            </div>
            <div class="h-scroll" id="featured-scroll">${topProducts.map(p => App.components.productCard(p)).join('')}</div>
          </div>

          <div class="section">
            <div class="section-header">
              <h3 class="section-title">🤲 ${T('donateForOrphan')}</h3>
              <button class="section-link" onclick="App.navigateTo('donors')">${T('viewAll')}</button>
            </div>
            <div class="h-scroll">${DB.donorLists.slice(0, 2).map(list => App.components.donorCard(list)).join('')}</div>
          </div>

          <div class="section">
            <div class="section-header"><h3 class="section-title">🛍️ ${T('shopNow')}</h3></div>
            <div class="product-grid" id="product-grid">${topProducts.map(p => App.components.productCardSmall(p)).join('')}</div>
          </div>
        </div>`;
    },

    products() {
      const T = App.L, ar = App.ar;
      const catLabels = [T('all'), T('kitchen'), T('appliances'), T('bedroom'), T('decor'), T('bathroom'), T('clothes')];
      const catValues = ['all','مطبخ','أجهزة','غرفة النوم','ديكور','حمام','ملابس'];
      return `
        <div class="page">
          <div class="cat-pills">${catLabels.map((cat, i) => `<button class="cat-pill ${i === 0 ? 'active' : ''}" data-category="${catValues[i]}">${cat}</button>`).join('')}</div>
          <div class="product-grid" id="all-products-grid">${DB.products.map(p => App.components.productCardSmall(p)).join('')}</div>
        </div>`;
    },

    wishlist() {
      const T = App.L, ar = App.ar;
      const myItems = DB.getMyWishlist();
      const inCart = myItems.length > 0 ? myItems : DB.cart;
      if (inCart.length === 0) {
        return `<div class="empty-state"><div class="empty-icon">💝</div><p class="empty-text">${T('emptyWishlist')}</p><p class="empty-text" style="font-size:0.85rem">${T('startAdding')}</p><button class="btn btn-primary mt-16" onclick="App.navigateTo('products')">${T('shopNowBtn')}</button></div>`;
      }
      return `<div class="page">
        <div class="text-center mb-16"><p style="color:var(--text-secondary)">${ar ? 'لديك' : 'You have'} ${inCart.length} ${ar ? 'منتج في القائمة' : T('itemsInList')}</p></div>
        ${inCart.map(item => `<div class="cart-item"><div class="cart-item-img">${item.emoji || '🎁'}</div><div class="cart-item-info"><div class="cart-item-title">${item.name}</div><div class="cart-item-price">${item.price.toLocaleString()} ${T('currency')}</div></div><button class="cart-item-remove" data-remove-cart="${item.id}">✕</button></div>`).join('')}
        <div class="cart-summary"><div class="cart-summary-row total"><span>${T('total')}</span><span>${inCart.reduce((s, i) => s + i.price, 0).toLocaleString()} ${T('currency')}</span></div></div>
        <div class="px-16"><button class="btn btn-primary btn-block mb-8" onclick="App.navigateTo('payment')">${T('normalPayment')}</button><button class="btn btn-gold btn-block" onclick="App.navigateTo('shareLink')">${T('createShareLink')}</button></div>
      </div>`;
    },

    cart() {
      const T = App.L, ar = App.ar;
      if (DB.cart.length === 0) {
        return `<div class="empty-state"><div class="empty-icon">🛒</div><p class="empty-text">${T('emptyCart')}</p><button class="btn btn-primary mt-16" onclick="App.navigateTo('products')">${T('shopNowBtn')}</button></div>`;
      }
      return `<div class="page">
        ${DB.cart.map(item => `<div class="cart-item"><div class="cart-item-img">${item.emoji || '🎁'}</div><div class="cart-item-info"><div class="cart-item-title">${item.name}</div><div class="cart-item-price">${item.price.toLocaleString()} ${T('currency')}</div></div><button class="cart-item-remove" data-remove-cart="${item.id}">✕</button></div>`).join('')}
        <div class="cart-summary">
          <div class="cart-summary-row"><span>${T('itemCount')}</span><span>${DB.cart.length}</span></div>
          <div class="cart-summary-row"><span>${T('freeShipping')}</span><span>${T('free')}</span></div>
          <div class="cart-summary-row total"><span>${T('total')}</span><span>${DB.getCartTotal().toLocaleString()} ${T('currency')}</span></div>
        </div>
        <div class="px-16"><button class="btn btn-primary btn-block mb-8" onclick="App.navigateTo('payment')">${T('continuePayment')}</button><button class="btn btn-gold btn-block" onclick="App.navigateTo('shareLink')">${T('createLinkForGivers')}</button></div>
      </div>`;
    },

    payment() {
      const T = App.L, ar = App.ar;
      const methods = [
        { id: 'instapay', icon: '📸', name: T('instapay'), desc: T('instapayDesc') },
        { id: 'vodafone', icon: '📱', name: T('vodafoneCash'), desc: T('vodafoneDesc') },
        { id: 'fawry', icon: '🏪', name: T('fawry'), desc: T('fawryDesc') },
        { id: 'paypal', icon: '💳', name: T('paypal'), desc: T('paypalDesc') },
        { id: 'stripe', icon: '💎', name: T('creditCard'), desc: T('creditCardDesc') },
      ];
      return `<div class="page">
        <div class="section"><h3 class="section-title mb-16">${T('selectPayment')}</h3>
          <div class="payment-options">${methods.map(m => `<div class="payment-option" data-payment="${m.id}"><div class="payment-icon">${m.icon}</div><div class="payment-info"><div class="payment-name">${m.name}</div><div class="payment-desc">${m.desc}</div></div><div class="payment-radio"></div></div>`).join('')}</div>
        </div>
        <div class="section px-16"><div class="form-group"><label class="form-label">${T('shippingAddress')}</label><textarea class="form-textarea" id="shipping-address" placeholder="${T('addressPlaceholder')}"></textarea></div></div>
        <div class="cart-summary mx-16"><div class="cart-summary-row total"><span>${T('amountToPay')}</span><span>${DB.getCartTotal().toLocaleString()} ${T('currency')}</span></div></div>
        <div class="section px-16" id="screenshot-section" style="display:none"><div class="form-group"><label class="form-label">${T('uploadScreenshot')}</label><div class="upload-zone" id="upload-zone"><div class="upload-icon">📷</div><div class="upload-text">${T('tapToUpload')}</div><input type="file" id="screenshot-input" accept="image/*" style="display:none"></div><img id="screenshot-preview" class="upload-preview hidden"></div></div>
        <div class="px-16 mb-24"><button class="btn btn-success btn-block" id="btn-confirm-payment">${T('confirmPayment')}</button></div>
      </div>`;
    },

    shareLink() {
      const T = App.L, ar = App.ar;
      const name = DB.currentUser?.name || (ar ? 'عروسة' : 'Bride');
      const avatars = ['👰','💐','💍','🎀','🌸','✨'];
      return `<div class="page">
        <div class="share-preview"><p class="mb-8 fw-700">${T('shareYourList')}</p><div class="image-picker-grid">${avatars.map((av, i) => `<div class="image-picker-option ${i === 0 ? 'selected' : ''}" data-avatar="${i + 1}">${av}</div>`).join('')}</div></div>
        <div class="share-preview"><div class="share-avatar">${avatars[0]}</div><div class="share-name">${name}</div><div class="share-msg">${T('sharedWithYou')}</div><p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:12px">${T('clickToPayGift')}</p></div>
        <div class="px-16"><button class="btn btn-primary btn-block mb-8" id="btn-generate-link">${T('generateLink')}</button><button class="btn btn-secondary btn-block" id="btn-copy-link" style="display:none">${T('copyLink')}</button></div>
        <div id="share-url-container" class="px-16 mt-16" style="display:none"><div class="share-url-box"><input type="text" class="share-url-input" id="share-url" readonly><button class="btn btn-primary btn-sm" id="btn-share-copy">${ar ? 'نسخ' : 'Copy'}</button></div><p class="text-center mt-8" style="font-size:0.8rem;color:var(--text-secondary)">${T('shareInGroups')}</p></div>
      </div>`;
    },

    shareView() {
      const T = App.L, ar = App.ar;
      if (!App.shareData) return `<div class="empty-state"><p>${ar ? 'الرابط غير صالح' : 'Invalid link'}</p></div>`;
      const name = App.shareData.name || (ar ? 'عروسة' : 'Bride');
      const avatars = ['👰','💐','💍','🎀','🌸','✨'];
      const avatar = avatars[App.shareData.avatar - 1] || avatars[0];
      const items = App.shareData.items.map(id => DB.products.find(p => p.id === id)).filter(Boolean);
      return `<div class="page">
        <div class="share-preview"><div class="share-avatar">${avatar}</div><div class="share-name">${name}</div><div class="share-msg">${T('sharedWithYou')}</div><p style="font-size:0.9rem;color:var(--text-secondary)">${ar ? 'اختر المنتجات التي تريد شراؤها هدية للعروسة' : 'Choose products to buy as gifts for the bride'}</p></div>
        <div class="section"><h3 class="section-title px-16 mb-16">${ar ? 'قائمة الأمنيات' : 'Wishlist'} (${items.length} ${ar ? 'منتجات' : 'items'})</h3>
        ${items.map(item => `<div class="cart-item"><div class="cart-item-img">${item.emoji || '🎁'}</div><div class="cart-item-info"><div class="cart-item-title">${item.name}</div><div class="cart-item-price">${item.price.toLocaleString()} ${T('currency')}</div></div><a href="${item.affiliateUrl}" target="_blank" class="btn btn-primary btn-sm">${ar ? 'شراء' : 'Buy'} 🛍️</a></div>`).join('')}</div>
        <div class="section px-16"><div class="form-group"><label class="form-label">${T('yourName')}</label><input type="text" class="form-input" id="giver-name" placeholder="${T('yourNamePlaceholder')}"></div><div class="form-group"><label class="form-label">${T('uploadScreenshot')}</label><div class="upload-zone" id="giver-upload-zone"><div class="upload-icon">📷</div><div class="upload-text">${T('tapToUpload')}</div><input type="file" id="giver-screenshot" accept="image/*" style="display:none"></div><img id="giver-preview" class="upload-preview hidden"></div></div>
        <div class="px-16 mb-24"><button class="btn btn-success btn-block" id="btn-giver-done">${T('idoneDone')}</button></div>
      </div>`;
    },

    donors() {
      const T = App.L, ar = App.ar;
      return `<div class="page">
        <div class="hero-banner" style="background:linear-gradient(135deg, #f7d774, #e6ac00)"><div class="hero-emoji">🤲</div><h2 class="hero-title">${T('donateForOrphan')}</h2><p class="hero-subtitle">${ar ? 'ساهم في تجهيز فتاة تريد البدء حياة جديدة' : 'Help prepare a girl starting a new life'}</p></div>
        ${DB.donorLists.map(list => App.components.donorCardFull(list)).join('')}
      </div>`;
    },

    profile() {
      const user = DB.currentUser; if (!user) return '';
      const T = App.L, ar = App.ar;
      const roleLabels = { bride: T('bride'), giver: T('giver'), donor: T('donor'), admin: T('admin') };
      const roleEmojis = { bride: '👰', giver: '🎁', donor: '🤲', admin: '⚙️' };
      return `
        <div class="profile-header"><div class="profile-avatar">${roleEmojis[user.role] || '👤'}</div><div class="profile-name">${user.name}</div><div class="profile-role">${roleLabels[user.role] || user.role}</div>
          <div class="profile-stats"><div class="profile-stat"><div class="profile-stat-num">${DB.cart.length}</div><div class="profile-stat-label">${ar ? 'في السلة' : 'In Cart'}</div></div><div class="profile-stat"><div class="profile-stat-num">${DB.orders.filter(o => o.buyerId === user.id).length}</div><div class="profile-stat-label">${ar ? 'طلبات' : 'Orders'}</div></div></div></div>
        <div class="menu-list">
          ${user.role === 'admin' ? `<div class="menu-item" onclick="App.navigateTo('admin')"><div class="menu-icon">⚙️</div><div class="menu-text">${T('adminPanel')}</div><div class="menu-arrow">‹</div></div><div class="menu-item" onclick="App.navigateTo('addProduct')"><div class="menu-icon">➕</div><div class="menu-text">${T('addProduct')}</div><div class="menu-arrow">‹</div></div><div class="menu-item" onclick="App.navigateTo('adminOrders')"><div class="menu-icon">📋</div><div class="menu-text">${T('allOrders')}</div><div class="menu-arrow">‹</div></div>` : ''}
          <div class="menu-item" onclick="App.navigateTo('wishlist')"><div class="menu-icon">💝</div><div class="menu-text">${T('myWishlistBtn')}</div><div class="menu-arrow">‹</div></div>
          <div class="menu-item" onclick="App.navigateTo('cart')"><div class="menu-icon">🛒</div><div class="menu-text">${T('myCart')}</div><div class="menu-arrow">‹</div></div>
          <div class="menu-item" onclick="App.navigateTo('notifications')"><div class="menu-icon">🔔</div><div class="menu-text">${ar ? 'الإشعارات' : 'Notifications'}</div><div class="menu-arrow">‹</div></div>
          <div class="menu-item" onclick="App.toggleDarkMode()"><div class="menu-icon">${document.body.classList.contains('dark-mode') ? '☀️' : '🌙'}</div><div class="menu-text">${document.body.classList.contains('dark-mode') ? T('lightMode') : T('darkMode')}</div><div class="menu-arrow">‹</div></div>
          <div class="menu-item" onclick="App.toggleLanguage()"><div class="menu-icon">🌐</div><div class="menu-text">${ar ? 'English' : 'العربية'}</div><div class="menu-arrow">‹</div></div>
          <div class="menu-item" onclick="App.navigateTo('privacyPolicy')"><div class="menu-icon">🔒</div><div class="menu-text">${T('privacyPolicy')}</div><div class="menu-arrow">‹</div></div>
          <div class="menu-item" onclick="App.navigateTo('termsOfUse')"><div class="menu-icon">📜</div><div class="menu-text">${T('termsOfUse')}</div><div class="menu-arrow">‹</div></div>
          <div class="menu-item" onclick="App.navigateTo('aboutUs')"><div class="menu-icon">ℹ️</div><div class="menu-text">${T('aboutUs')}</div><div class="menu-arrow">‹</div></div>
          <div class="menu-item" onclick="App.confirmDeleteAccount()"><div class="menu-icon">🗑️</div><div class="menu-text text-danger">${T('deleteAccount')}</div><div class="menu-arrow">‹</div></div>
          <div class="menu-item" onclick="App.handleLogout()"><div class="menu-icon">🚪</div><div class="menu-text text-danger">${T('logout')}</div><div class="menu-arrow">‹</div></div>
        </div>`;
    },

    admin() {
      const ar = App.ar, T = App.L;
      return `<div class="page">
        <div class="admin-stat-cards">
          <div class="admin-stat-card"><div class="admin-stat-num">${DB.products.length}</div><div class="admin-stat-label">${ar ? 'المنتجات' : 'Products'}</div></div>
          <div class="admin-stat-card"><div class="admin-stat-num">${DB.orders.length}</div><div class="admin-stat-label">${ar ? 'الطلبات' : 'Orders'}</div></div>
          <div class="admin-stat-card"><div class="admin-stat-num">${DB.users.filter(u => u.role === 'bride').length}</div><div class="admin-stat-label">${T('bride')}s</div></div>
          <div class="admin-stat-card"><div class="admin-stat-num">${DB.users.filter(u => u.role === 'giver').length}</div><div class="admin-stat-label">${T('giver')}s</div></div>
        </div>
        <div class="menu-list">
          <div class="menu-item" onclick="App.navigateTo('addProduct')"><div class="menu-icon">➕</div><div class="menu-text">${ar ? 'إضافة منتج جديد' : 'Add New Product'}</div><div class="menu-arrow">‹</div></div>
          <div class="menu-item" onclick="App.navigateTo('adminOrders')"><div class="menu-icon">📋</div><div class="menu-text">${ar ? 'إدارة الطلبات' : 'Manage Orders'}</div><div class="menu-arrow">‹</div></div>
        </div>
        <div class="section"><h3 class="section-title px-16 mb-16">${T('products')} (${DB.products.length})</h3>
          ${DB.products.map(p => `<div class="cart-item"><div class="cart-item-img">${p.emoji || '🎁'}</div><div class="cart-item-info"><div class="cart-item-title">${p.name}</div><div class="cart-item-price">${p.price.toLocaleString()} ${T('currency')}</div></div><button class="cart-item-remove" onclick="DB.removeProduct(${p.id});App.render('admin')">✕</button></div>`).join('')}
        </div></div>`;
    },

    addProduct() {
      const T = App.L, ar = App.ar;
      const emojis = ['🍳','🧺','🛏️','🤖','🍽️','💨','🛁','🏠','🔪','❄️','👗','🪞','📺','🧹','☕','🧴'];
      return `<div class="page"><div class="px-16">
        <div class="form-group"><label class="form-label">${T('productName')}</label><input type="text" class="form-input" id="prod-name" placeholder="${ar ? 'مثال: طقم أواني فاخر' : 'e.g. Premium Cookware Set'}"></div>
        <div class="form-group"><label class="form-label">${T('description')}</label><textarea class="form-textarea" id="prod-desc" placeholder="${ar ? 'وصف المنتج...' : 'Product description...'}"></textarea></div>
        <div class="form-group"><label class="form-label">${T('price')}</label><input type="number" class="form-input" id="prod-price" placeholder="0"></div>
        <div class="form-group"><label class="form-label">${T('category')}</label><select class="form-select" id="prod-category"><option value="مطبخ">${T('kitchen')}</option><option value="أجهزة">${T('appliances')}</option><option value="غرفة النوم">${T('bedroom')}</option><option value="ديكور">${T('decor')}</option><option value="حمام">${T('bathroom')}</option><option value="ملابس">${T('clothes')}</option></select></div>
        <div class="form-group"><label class="form-label">${T('affiliateLink')}</label><input type="url" class="form-input" id="prod-url" placeholder="https://..."><input type="url" class="form-input mt-8" id="prod-media" placeholder="${T('mediaLink')}"></div>
        <div class="form-group"><label class="form-label">${T('productIcon')}</label><div class="image-picker-grid">${emojis.map((e, i) => `<div class="image-picker-option ${i === 0 ? 'selected' : ''}" data-emoji="${e}" onclick="document.querySelectorAll('[data-emoji]').forEach(x=>x.classList.remove('selected'));this.classList.add('selected')">${e}</div>`).join('')}</div></div>
        <button class="btn btn-primary btn-block mt-16" id="btn-add-product">${T('addProductBtn')}</button>
        <button class="btn btn-secondary btn-block mt-8" onclick="App.goBack()">${T('cancel')}</button>
      </div></div>`;
    },

    adminOrders() {
      const T = App.L, ar = App.ar;
      if (DB.orders.length === 0) return `<div class="empty-state"><div class="empty-icon">📋</div><p class="empty-text">${T('noOrders')}</p></div>`;
      const statusMap = { pending: T('pending'), paid: T('paid'), shipped: T('shipped') };
      return `<div class="page">${DB.orders.map(order => `<div class="order-item"><div style="flex:1"><div class="fw-700">${order.buyerName || (ar ? 'مجهول' : 'Unknown')}</div><div style="font-size:0.8rem;color:var(--text-secondary)">${order.paymentMethod || ''} • ${order.total?.toLocaleString() || 0} ${T('currency')}</div><div style="font-size:0.75rem;color:var(--text-light)">${new Date(order.createdAt).toLocaleString(ar ? 'ar-EG' : 'en-US')}</div></div><span class="order-status ${order.status}">${statusMap[order.status] || order.status}</span></div>`).join('')}</div>`;
    },

    notifications() {
      const T = App.L, ar = App.ar;
      if (DB.notifications.length === 0) return `<div class="empty-state"><div class="empty-icon">🔔</div><p class="empty-text">${T('noNotifications')}</p></div>`;
      DB.markAllRead(); App.updateNotifBadge();
      return `<div class="page">${DB.notifications.map(n => {
        const icon = n.type === 'payment' ? '💰' : n.type === 'donation' ? '🤲' : '🔔';
        const cls = n.type === 'payment' ? 'payment' : n.type === 'donation' ? 'donation' : 'system';
        return `<div class="notif-item"><div class="notif-icon-wrap ${cls}">${icon}</div><div class="notif-content"><div class="notif-text">${n.text}</div><div class="notif-time">${App.timeAgo(n.time)}</div></div></div>`;
      }).join('')}</div>`;
    },

    thankYou() {
      const T = App.L, ar = App.ar;
      return `<div class="thankyou">
        <div class="thankyou-icon">🎉</div>
        <h2 class="thankyou-title">${T('thankYouTitle')}</h2>
        <p style="color:var(--text-secondary);font-size:1rem">${T('thankYouMsg')}</p>
        <div class="thankyou-dhikr">${ar ? '﴿ وَمَا تُقَدِّمُوا لِأَنفُسِكُم مِّنْ خَيْرٍ تَجِدُوهُ عِندَ اللَّهِ ﴾<br><br>صدق الله العظيم' : 'Whatever good you put forward for yourselves - you will find it with Allah.<br><br>Sadaqa Allahu Al-Adheem'}</div>
        <button class="btn btn-primary btn-block" onclick="App.navigateTo('home')">${ar ? 'العودة للرئيسية' : 'Back to Home'}</button>
        <button class="btn btn-secondary btn-block mt-8" onclick="App.navigateTo('donors')">${T('donateForAnother')}</button>
      </div>`;
    },

    // Legal pages stay bilingual (already have lang toggle)
    privacyPolicy() {
      return `<div class="legal-page">
        <div class="lang-toggle"><button class="lang-btn active" onclick="document.getElementById('privacy-ar').style.display='';document.getElementById('privacy-en').style.display='none';this.classList.add('active');this.nextElementSibling.classList.remove('active')">العربية</button><button class="lang-btn" onclick="document.getElementById('privacy-ar').style.display='none';document.getElementById('privacy-en').style.display='';this.classList.add('active');this.previousElementSibling.classList.remove('active')">English</button></div>
        <div id="privacy-ar"><h2>🔒 سياسة الخصوصية</h2><p><strong>آخر تحديث:</strong> أبريل 2025</p><p>نحن في تطبيق "جهاز البنات" نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية.</p><h3>1. المعلومات التي نجمعها</h3><ul><li>الاسم والبريد الإلكتروني ورقم الهاتف</li><li>معلومات الطلبات والعناوين</li><li>صور إيصالات الدفع</li><li>قوائم الأمنيات</li></ul><h3>2. استخدام المعلومات</h3><ul><li>توفير خدمات المنصة</li><li>معالجة الطلبات والدفع</li><li>إرسال إشعارات الطلبات والعروض</li><li>تحسين تجربة المستخدم</li></ul><h3>3. حماية البيانات</h3><p>نستخدم تشفير متقدم لحماية بياناتك. لا نشارك معلوماتك مع أطراف ثالثة without موافقتك.</p><h3>4. حقوقك</h3><ul><li>الوصول لبياناتك وتعديلها</li><li>طلب حذف حسابك</li><li>الاعتراض على معالجة بياناتك</li></ul><h3>5. التواصل</h3><p>للاستفسارات: <strong>privacy@jihaz-albanat.com</strong></p></div>
        <div id="privacy-en" style="display:none"><h2>🔒 Privacy Policy</h2><p><strong>Last Updated:</strong> April 2025</p><p>At "Jihaz Al-Banat", we respect your privacy and protect your personal data.</p><h3>1. Information We Collect</h3><ul><li>Name, email, phone number on registration</li><li>Order info and shipping addresses</li><li>Payment screenshots uploaded voluntarily</li><li>Wishlists and favorites</li></ul><h3>2. How We Use It</h3><ul><li>Providing platform services</li><li>Processing orders and payments</li><li>Sending order notifications and offers</li><li>Improving user experience</li></ul><h3>3. Data Protection</h3><p>We use advanced encryption. We don't share your info with third parties without consent.</p><h3>4. Your Rights</h3><ul><li>Access and modify your data</li><li>Request account deletion</li><li>Object to data processing</li></ul><h3>5. Contact</h3><p>For inquiries: <strong>privacy@jihaz-albanat.com</strong></p></div></div>`;
    },

    termsOfUse() {
      return `<div class="legal-page">
        <div class="lang-toggle"><button class="lang-btn active" onclick="document.getElementById('terms-ar').style.display='';document.getElementById('terms-en').style.display='none';this.classList.add('active');this.nextElementSibling.classList.remove('active')">العربية</button><button class="lang-btn" onclick="document.getElementById('terms-ar').style.display='none';document.getElementById('terms-en').style.display='';this.classList.add('active');this.previousElementSibling.classList.remove('active')">English</button></div>
        <div id="terms-ar"><h2>📜 شروط الاستخدام</h2><p><strong>آخر تحديث:</strong> أبريل 2025</p><p>باستخدامك التطبيق، توافق على الشروط التالية:</p><h3>1. القبول والتسجيل</h3><ul><li>يجب أن يكون عمرك 18 سنة أو أكثر</li><li>تقديم معلومات صحيحة عند التسجيل</li><li>المسؤولية عن سرية حسابك</li></ul><h3>2. الاستخدام المقبول</h3><ul><li>يُمنع الاستخدام غير المشروع</li><li>يُمنع نشر محتوى مسيء</li><li>يُمنع اختراق الخدمة</li></ul><h3>3. المنتجات والدفع</h3><ul><li>الأسعار بالجنيه المصري</li><li>الروابط تؤدي لمواقع خارجية (أفليت)</li><li>الدفع عبر إنستا باي، فودافون كاش، فوري، باي بال، أو بطاقة ائتمان</li></ul><h3>4. التبرعات</h3><ul><li>التبرعات تذهب مباشرة للفتيات</li><li>لا عمولات على التبرعات</li></ul><h3>5. القانون الحاكم</h3><p>تخضع للقوانين المصرية.</p></div>
        <div id="terms-en" style="display:none"><h2>📜 Terms of Use</h2><p><strong>Last Updated:</strong> April 2025</p><p>By using the app, you agree to:</p><h3>1. Acceptance & Registration</h3><ul><li>You must be 18+ to create an account</li><li>Provide accurate information</li><li>Maintain account confidentiality</li></ul><h3>2. Acceptable Use</h3><ul><li>No illegal use</li><li>No offensive content</li><li>No hacking attempts</li></ul><h3>3. Products & Payment</h3><ul><li>Prices in Egyptian Pounds</li><li>Links lead to external (affiliate) sites</li><li>Payment via InstaPay, Vodafone Cash, Fawry, PayPal, or Credit Card</li></ul><h3>4. Donations</h3><ul><li>Donations go directly to beneficiaries</li><li>No commissions on donations</li></ul><h3>5. Governing Law</h3><p>Governed by Egyptian law.</p></div></div>`;
    },

    aboutUs() {
      return `<div class="legal-page">
        <div class="lang-toggle"><button class="lang-btn active" onclick="document.getElementById('about-ar').style.display='';document.getElementById('about-en').style.display='none';this.classList.add('active');this.nextElementSibling.classList.remove('active')">العربية</button><button class="lang-btn" onclick="document.getElementById('about-ar').style.display='none';document.getElementById('about-en').style.display='';this.classList.add('active');this.previousElementSibling.classList.remove('active')">English</button></div>
        <div id="about-ar"><h2>ℹ️ من نحن</h2><p>تطبيق <strong>"جهاز البنات"</strong> منصة ذكية لتجهيز العرائس وهدايا الزواج.</p><h3>💡 رؤيتنا</h3><p>كل عروسة تستحق جهاز كامل. نربط العرائس بمن يحبونهم.</p><h3>🎯 مهمتنا</h3><ul><li>تجربة تسوق ذكية لتجهيز العرائس</li><li>تمكين إنشاء قوائم أمنيات ومشاركتها</li><li>دعم الفتيات اليتيمات</li></ul><h3>📞 تواصل معنا</h3><p>البريد: <strong>support@jihaz-albanat.com</strong></p><p style="text-align:center;margin-top:24px;font-size:2rem">💍</p></div>
        <div id="about-en" style="display:none"><h2>ℹ️ About Us</h2><p><strong>"Jihaz Al-Banat"</strong> is a smart platform for bridal preparations and wedding gifts.</p><h3>💡 Our Vision</h3><p>Every bride deserves a complete trousseau. We connect brides with those who love them.</p><h3>🎯 Our Mission</h3><ul><li>Smart shopping experience for bridal prep</li><li>Enable wishlist creation and sharing</li><li>Support orphaned girls</li></ul><h3>📞 Contact</h3><p>Email: <strong>support@jihaz-albanat.com</strong></p><p style="text-align:center;margin-top:24px;font-size:2rem">💍</p></div></div>`;
    },
  },

  // ===== Components =====
  components: {
    productCard(p) {
      const T = App.L;
      return `<div class="card" data-product-id="${p.id}"><div class="card-img">${p.emoji || '🎁'}</div><div class="card-body"><div class="card-title">${p.name}</div><div class="card-desc">${p.desc}</div></div><div class="card-footer"><div class="card-price">${p.price.toLocaleString()} <span class="currency">${T('currency')}</span></div><button class="btn-add-cart" data-add-cart="${p.id}" title="+">+</button></div></div>`;
    },
    productCardSmall(p) {
      const T = App.L;
      return `<div class="card" data-product-id="${p.id}"><div class="card-img">${p.emoji || '🎁'}</div><div class="card-body"><div class="card-title" style="font-size:0.9rem">${p.name}</div><div class="card-price" style="font-size:0.95rem">${p.price.toLocaleString()} <span class="currency">${T('currency')}</span></div></div><div class="card-footer"><span style="font-size:0.75rem;color:var(--text-light)">${p.category}</span><button class="btn-add-cart" data-add-cart="${p.id}" style="width:30px;height:30px;font-size:1rem">+</button></div></div>`;
    },
    donorCard(list) {
      const T = App.L, ar = App.ar;
      const pct = Math.round((list.funded / list.total) * 100);
      return `<div class="card" onclick="App.navigateTo('donors')" style="min-width:260px;scroll-snap-align:start"><div class="card-body" style="border-right:4px solid var(--accent)"><div class="donor-card-header" style="margin-bottom:8px"><div class="donor-avatar" style="width:40px;height:40px;font-size:18px">👧</div><div><div class="donor-name" style="font-size:0.9rem">${list.girlName}</div><div class="donor-status">${list.age} ${T('yearsOld')}</div></div></div><div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div><div class="progress-text"><span>${list.funded.toLocaleString()} / ${list.total.toLocaleString()} ${T('currency')}</span><span>${pct}%</span></div></div></div>`;
    },
    donorCardFull(list) {
      const T = App.L, ar = App.ar;
      const pct = Math.round((list.funded / list.total) * 100);
      const items = list.items.map(id => DB.products.find(p => p.id === id)).filter(Boolean);
      return `<div class="donor-card"><div class="donor-card-header"><div class="donor-avatar">👧</div><div><div class="donor-name">${list.girlName}</div><div class="donor-status">${list.age} ${T('yearsOld')} • ${list.donors} ${T('donors_count')}</div></div></div><p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px">${list.story}</p><div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div><div class="progress-text"><span>${list.funded.toLocaleString()} / ${list.total.toLocaleString()} ${T('currency')}</span><span>${pct}%</span></div><div style="margin-top:12px"><p style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:8px">${T('requiredProducts')}</p>${items.map(item => `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:0.85rem"><span>${item.emoji}</span><span style="flex:1">${item.name}</span><span style="color:var(--primary-dark);font-weight:700">${item.price.toLocaleString()} ${T('currency')}</span></div>`).join('')}</div><button class="btn btn-gold btn-block mt-16" data-donate-list="${list.id}">${T('donateNow')}</button></div>`;
    },
  },

  // ===== Handlers =====
  handleLogout() {
    DB.logout();
    document.getElementById('app-header').style.display = 'none';
    document.getElementById('bottom-nav').style.display = 'none';
    this.viewHistory = [];
    this.render('auth');
    this.showToast(this.L('logoutSuccess'));
  },

  confirmDeleteAccount() {
    const T = this.L;
    this.openModal(`<div class="modal-handle"></div><div style="text-align:center;padding:16px 0"><div style="font-size:48px;margin-bottom:16px">⚠️</div><h3 class="modal-title">${T('deleteAccount')}</h3><p style="color:var(--text-secondary);text-align:center;margin-bottom:24px">${T('deleteAccountConfirm')}</p><div style="display:flex;gap:12px"><button class="btn btn-danger btn-block" style="background:var(--danger);color:#fff" onclick="DB.deleteAccount();App.closeModal();App.handleLogout();App.showToast(App.L('accountDeleted'))">${T('yes')}</button><button class="btn btn-secondary btn-block" onclick="App.closeModal()">${T('cancel')}</button></div></div>`);
  },

  handlePayment() {
    const T = this.L;
    if (!this.selectedPayment) return this.showToast(T('selectPaymentFirst'));
    const address = document.getElementById('shipping-address')?.value?.trim();
    if (!address) return this.showToast(T('enterAddress'));
    DB.createOrder({ buyerId: DB.currentUser?.id, buyerName: DB.currentUser?.name, items: [...DB.cart], total: DB.getCartTotal(), paymentMethod: this.selectedPayment, shippingAddress: address });
    DB.clearCart();
    this.updateCartBadge();
    this.navigateTo('thankYou');
  },

  handleShareLink() {
    const items = DB.cart.length > 0 ? DB.cart : DB.getMyWishlist();
    if (items.length === 0) return this.showToast(this.L('addProductsFirst'));
    const link = DB.generateShareLink(items, DB.currentUser?.name || (this.ar ? 'عروسة' : 'Bride'), this.selectedAvatar);
    const urlInput = document.getElementById('share-url');
    const container = document.getElementById('share-url-container');
    const copyBtn = document.getElementById('btn-copy-link');
    if (urlInput) { urlInput.value = link; container.style.display = ''; copyBtn.style.display = ''; }
    this.showToast(this.L('linkCreated'));
  },

  handleGiverDone() {
    const name = document.getElementById('giver-name')?.value?.trim();
    DB.createOrder({ buyerName: name || (this.ar ? 'مجامل كريم' : 'Kind Giver'), items: App.shareData?.items?.map(id => DB.products.find(p => p.id === id)).filter(Boolean) || [], total: 0, paymentMethod: 'share_link', type: 'giver' });
    DB.addNotification('payment', `${name || (this.ar ? 'مجامل' : 'A giver')} ${this.ar ? 'أهدى هدايا لعروسة' : 'gifted items'}`);
    this.navigateTo('thankYou');
  },

  showProductDetail(id) {
    const p = DB.products.find(pr => pr.id === id);
    if (!p) return;
    const T = this.L, ar = this.ar;
    this.openModal(`<div class="modal-handle"></div><div style="text-align:center;font-size:64px;margin-bottom:16px">${p.emoji || '🎁'}</div><h3 class="modal-title">${p.name}</h3><p style="color:var(--text-secondary);margin-bottom:16px;text-align:center">${p.desc}</p><p style="text-align:center;font-size:1.4rem;font-weight:900;color:var(--primary-dark);margin-bottom:20px">${p.price.toLocaleString()} ${T('currency')}</p><p style="font-size:0.8rem;color:var(--text-light);margin-bottom:12px;text-align:center">${T('category')}: ${p.category}</p>${p.mediaUrl ? `<p style="margin-bottom:12px;text-align:center"><a href="${p.mediaUrl}" target="_blank" style="color:var(--primary)">${ar ? 'عرض الصورة/الفيديو' : 'View Image/Video'}</a></p>` : ''}<div style="display:flex;gap:8px"><a href="${p.affiliateUrl}" target="_blank" class="btn btn-secondary" style="flex:1">${T('buyDirect')}</a><button class="btn btn-primary" style="flex:1" data-add-cart="${p.id}" onclick="App.closeModal()">${T('addToCart')}</button></div>`);
  },

  showDonorPayment(listId) {
    const list = DB.donorLists.find(l => l.id === listId);
    if (!list) return;
    const T = this.L, ar = this.ar;
    const remaining = list.total - list.funded;
    this.openModal(`<div class="modal-handle"></div><h3 class="modal-title">${T('donateFor')} ${list.girlName} 🤲</h3><p style="text-align:center;color:var(--text-secondary);margin-bottom:20px">${T('remaining')}: ${remaining.toLocaleString()} ${T('currency')}</p><div class="form-group"><label class="form-label">${T('amount')}</label><input type="number" class="form-input" id="donation-amount" placeholder="0" value="${remaining}"></div><div class="form-group"><label class="form-label">${T('donorName')}</label><input type="text" class="form-input" id="donor-name" placeholder="${T('donorNamePlaceholder')}"></div><div class="payment-options" style="padding:0"><div class="payment-option" data-payment="instapay" onclick="document.querySelectorAll('.payment-option').forEach(x=>x.classList.remove('selected'));this.classList.add('selected')"><div class="payment-icon">📸</div><div class="payment-info"><div class="payment-name">${T('instapay')}</div></div><div class="payment-radio"></div></div><div class="payment-option" data-payment="vodafone" onclick="document.querySelectorAll('.payment-option').forEach(x=>x.classList.remove('selected'));this.classList.add('selected')"><div class="payment-icon">📱</div><div class="payment-info"><div class="payment-name">${T('vodafoneCash')}</div></div><div class="payment-radio"></div></div><div class="payment-option" data-payment="paypal" onclick="document.querySelectorAll('.payment-option').forEach(x=>x.classList.remove('selected'));this.classList.add('selected')"><div class="payment-icon">💳</div><div class="payment-info"><div class="payment-name">${T('paypal')}</div></div><div class="payment-radio"></div></div></div><button class="btn btn-gold btn-block mt-24" onclick="App.processDonation(${listId})">${T('confirmDonation')}</button>`);
  },

  processDonation(listId) {
    const amount = parseInt(document.getElementById('donation-amount')?.value) || 0;
    if (amount <= 0) return this.showToast(this.L('enterValidAmount'));
    const list = DB.donorLists.find(l => l.id === listId);
    if (list) { list.funded = Math.min(list.funded + amount, list.total); list.donors++; DB.save('donorLists'); }
    const donorName = document.getElementById('donor-name')?.value?.trim() || (this.ar ? 'متبرع كريم' : 'Generous Donor');
    DB.addNotification('donation', `${donorName} ${this.ar ? 'تبرع بـ' : 'donated'} ${amount.toLocaleString()} ${this.ar ? 'جنيه لـ' : 'EGP to'} ${list.girlName}`);
    this.closeModal(); this.render('donors'); this.showToast(this.L('donationSuccess'));
  },

  // ===== Utility =====
  timeAgo(ts) {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return this.L('now');
    if (mins < 60) return this.ar ? `منذ ${mins} دقيقة` : `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return this.ar ? `منذ ${hrs} ساعة` : `${hrs} hrs ago`;
    const days = Math.floor(hrs / 24);
    return this.ar ? `منذ ${days} يوم` : `${days} days ago`;
  },

  filterProducts(category) {
    const grid = document.getElementById('product-grid') || document.getElementById('all-products-grid') || document.getElementById('featured-scroll');
    if (!grid) return;
    const filtered = category === 'all' ? DB.products : DB.products.filter(p => p.category === category);
    const isScroll = grid.id === 'featured-scroll';
    grid.innerHTML = isScroll ? filtered.map(p => App.components.productCard(p)).join('') : filtered.map(p => App.components.productCardSmall(p)).join('');
    this.bindDynamicEvents('products');
  },
};

// ===== Start =====
document.addEventListener('DOMContentLoaded', () => App.init());

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
