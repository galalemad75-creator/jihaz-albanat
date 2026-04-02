// ===== جهاز البنات - Data Layer =====

const DB = {
  // ===== Users Store =====
  users: JSON.parse(localStorage.getItem('jb_users') || '[]'),
  
  // ===== Current Session =====
  currentUser: JSON.parse(localStorage.getItem('jb_current_user') || 'null'),
  
  // ===== Products (Admin manages) =====
  products: JSON.parse(localStorage.getItem('jb_products') || '[]'),
  
  // ===== Wishlists =====
  wishlists: JSON.parse(localStorage.getItem('jb_wishlists') || '[]'),
  
  // ===== Cart =====
  cart: JSON.parse(localStorage.getItem('jb_cart') || '[]'),
  
  // ===== Orders =====
  orders: JSON.parse(localStorage.getItem('jb_orders') || '[]'),
  
  // ===== Notifications =====
  notifications: JSON.parse(localStorage.getItem('jb_notifications') || '[]'),
  
  // ===== Donor Wishlists =====
  donorLists: JSON.parse(localStorage.getItem('jb_donor_lists') || '[]'),

  // ===== Save Methods =====
  save(key) {
    const map = {
      users: 'jb_users',
      currentUser: 'jb_current_user',
      products: 'jb_products',
      wishlists: 'jb_wishlists',
      cart: 'jb_cart',
      orders: 'jb_orders',
      notifications: 'jb_notifications',
      donorLists: 'jb_donor_lists',
    };
    if (map[key]) {
      localStorage.setItem(map[key], JSON.stringify(this[key]));
    }
  },

  // ===== Initialize with Demo Data =====
  init() {
    if (this.products.length === 0) {
      this.products = [
        { id: 1, name: 'طقم أواني طبخ فاخر', desc: 'طقم 12 قطعة من الستانلس ستيل عالي الجودة', price: 2500, emoji: '🍳', category: 'مطبخ', affiliateUrl: 'https://example.com/product/1', adminId: 'admin' },
        { id: 2, name: 'غسالة ملابس ذكية', desc: 'غسالة 8 كيلو بخاصية التجفيف', price: 8500, emoji: '🧺', category: 'أجهزة', affiliateUrl: 'https://example.com/product/2', adminId: 'admin' },
        { id: 3, name: 'طقم مفارش سرير فاخر', desc: 'مفارش قطن مصري 100% - 6 قطع', price: 1800, emoji: '🛏️', category: 'غرفة النوم', affiliateUrl: 'https://example.com/product/3', adminId: 'admin' },
        { id: 4, name: 'مكنسة كهربائية روبوت', desc: 'مكنسة ذكية بخاصية التنظيف التلقائي', price: 4200, emoji: '🤖', category: 'أجهزة', affiliateUrl: 'https://example.com/product/4', adminId: 'admin' },
        { id: 5, name: 'طقم أطباق خزف فاخر', desc: '24 قطعة من الخزف الأبيض الراقي', price: 1200, emoji: '🍽️', category: 'مطبخ', affiliateUrl: 'https://example.com/product/5', adminId: 'admin' },
        { id: 6, name: 'مروحة سقف كريستال', desc: 'مروحة سقف بتصميم كلاسيكي أنيق', price: 3500, emoji: '💨', category: 'ديكور', affiliateUrl: 'https://example.com/product/6', adminId: 'admin' },
        { id: 7, name: 'طقم مناشف حمام فاخرة', desc: '12 منشفة من القطن المصري', price: 950, emoji: '🛁', category: 'حمام', affiliateUrl: 'https://example.com/product/7', adminId: 'admin' },
        { id: 8, name: 'سيراميك أرضيات فاخر', desc: 'بلاط سيراميك إيطالي - 40 متر', price: 6000, emoji: '🏠', category: 'ديكور', affiliateUrl: 'https://example.com/product/8', adminId: 'admin' },
        { id: 9, name: 'طقم سكاكين شيف احترافي', desc: '6 سكاكين من الفولاذ الألماني', price: 1500, emoji: '🔪', category: 'مطبخ', affiliateUrl: 'https://example.com/product/9', adminId: 'admin' },
        { id: 10, name: 'ثلاجة ذكية', desc: 'ثلاجة 14 قدم بخاصية الديفروست', price: 12000, emoji: '❄️', category: 'أجهزة', affiliateUrl: 'https://example.com/product/10', adminId: 'admin' },
        { id: 11, name: 'طقم ملابس نوم حرير', desc: '3 قطع من الحرير الطبيعي', price: 800, emoji: '👗', category: 'ملابس', affiliateUrl: 'https://example.com/product/11', adminId: 'admin' },
        { id: 12, name: 'مرايا غرفة ملابس LED', desc: 'مرايا بإضاءة LED مدمجة', price: 2200, emoji: '🪞', category: 'ديكور', affiliateUrl: 'https://example.com/product/12', adminId: 'admin' },
      ];
      this.save('products');
    }

    if (this.donorLists.length === 0) {
      this.donorLists = [
        {
          id: 1,
          girlName: 'سارة أحمد',
          age: 22,
          story: 'فتاة يتيمة تعمل بجهد لتجهيز نفسها للزواج',
          items: [1, 3, 5, 7],
          funded: 1200,
          total: 6450,
          donors: 3,
        },
        {
          id: 2,
          girlName: 'نور محمد',
          age: 24,
          story: 'تتيمت منذ الصغر وتريد البدء حياة جديدة',
          items: [2, 6, 8],
          funded: 6000,
          total: 17500,
          donors: 5,
        },
        {
          id: 3,
          girlName: 'مريم خالد',
          age: 20,
          story: 'فتاة طموحة تحلم ببيت دافئ',
          items: [4, 9, 10, 11, 12],
          funded: 3500,
          total: 20700,
          donors: 2,
        },
      ];
      this.save('donorLists');
    }

    if (this.notifications.length === 0) {
      this.notifications = [
        { id: 1, type: 'system', text: 'مرحباً بك في جهاز البنات! 💍', time: Date.now() - 3600000, read: false },
        { id: 2, type: 'donation', text: 'تبرع جديد لقائمة سارة أحمد بقيمة 500 جنيه', time: Date.now() - 1800000, read: false },
      ];
      this.save('notifications');
    }

    // Create admin if not exists
    if (!this.users.find(u => u.role === 'admin')) {
      this.users.push({
        id: 'admin',
        name: 'المدير',
        email: 'admin@jihaz.app',
        phone: '01000000000',
        password: 'admin123',
        role: 'admin',
        createdAt: Date.now(),
      });
      this.save('users');
    }
  },

  // ===== Auth Methods =====
  register(data) {
    if (this.users.find(u => u.email === data.email)) {
      return { success: false, message: 'البريد الإلكتروني مسجل بالفعل' };
    }
    const user = {
      id: 'user_' + Date.now(),
      ...data,
      createdAt: Date.now(),
    };
    this.users.push(user);
    this.save('users');
    this.currentUser = user;
    this.save('currentUser');
    return { success: true, user };
  },

  login(email, password) {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (!user) return { success: false, message: 'بيانات الدخول غير صحيحة' };
    this.currentUser = user;
    this.save('currentUser');
    return { success: true, user };
  },

  logout() {
    this.currentUser = null;
    this.cart = [];
    this.save('currentUser');
    this.save('cart');
  },

  // ===== Cart Methods =====
  addToCart(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;
    if (!this.cart.find(c => c.id === productId)) {
      this.cart.push({ ...product, addedAt: Date.now() });
      this.save('cart');
      return true;
    }
    return false;
  },

  removeFromCart(productId) {
    this.cart = this.cart.filter(c => c.id !== productId);
    this.save('cart');
  },

  clearCart() {
    this.cart = [];
    this.save('cart');
  },

  getCartTotal() {
    return this.cart.reduce((sum, item) => sum + item.price, 0);
  },

  // ===== Wishlist Methods =====
  getMyWishlist() {
    if (!this.currentUser) return [];
    const wl = this.wishlists.find(w => w.userId === this.currentUser.id);
    return wl ? wl.items : [];
  },

  saveWishlist(items) {
    if (!this.currentUser) return;
    let wl = this.wishlists.find(w => w.userId === this.currentUser.id);
    if (wl) {
      wl.items = items;
      wl.updatedAt = Date.now();
    } else {
      wl = {
        id: 'wl_' + Date.now(),
        userId: this.currentUser.id,
        userName: this.currentUser.name,
        items,
        createdAt: Date.now(),
      };
      this.wishlists.push(wl);
    }
    this.save('wishlists');
  },

  // ===== Product Methods (Admin) =====
  addProduct(data) {
    const product = {
      id: Date.now(),
      ...data,
      adminId: this.currentUser?.id || 'admin',
      createdAt: Date.now(),
    };
    this.products.push(product);
    this.save('products');
    return product;
  },

  removeProduct(id) {
    this.products = this.products.filter(p => p.id !== id);
    this.save('products');
  },

  // ===== Order Methods =====
  createOrder(data) {
    const order = {
      id: 'ord_' + Date.now(),
      ...data,
      status: 'pending',
      createdAt: Date.now(),
    };
    this.orders.push(order);
    this.save('orders');

    // Add notification
    this.addNotification('payment', `طلب جديد من ${data.buyerName || 'مجهول'} بقيمة ${data.total} جنيه`);
    
    return order;
  },

  // ===== Notification Methods =====
  addNotification(type, text) {
    this.notifications.unshift({
      id: Date.now(),
      type,
      text,
      time: Date.now(),
      read: false,
    });
    this.save('notifications');
  },

  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  },

  markAllRead() {
    this.notifications.forEach(n => n.read = true);
    this.save('notifications');
  },

  // ===== Share Link =====
  generateShareLink(wishlistItems, userName, avatarIndex) {
    const data = {
      items: wishlistItems.map(i => i.id),
      name: userName,
      avatar: avatarIndex,
      created: Date.now(),
    };
    const encoded = btoa(JSON.stringify(data));
    return `${window.location.origin}${window.location.pathname}?share=${encoded}`;
  },
};

// Initialize DB
DB.init();
