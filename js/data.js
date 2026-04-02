// ===== جهاز البنات - Internationalization =====
const I18N = {
  currentLang: localStorage.getItem('jb_lang') || 'ar',
  
  translations: {
    ar: {
      appTitle: 'جهاز البنات 💍',
      home: 'الرئيسية',
      wishlist: 'أمنياتي',
      donors: 'متبرعين',
      profile: 'حسابي',
      cart: 'عربة التسوق 🛒',
      notifications: 'الإشعارات 🔔',
      backToHome: 'الرئيسية',
      login: 'تسجيل الدخول',
      register: 'حساب جديد',
      email: 'البريد אימייל',
      password: 'كلمة المرور',
      forgotPassword: 'نسيت كلمة المرور؟',
      fullName: 'الاسم الكامل',
      phone: 'رقم الهاتف',
      accountType: 'نوع الحساب',
      bride: 'عروسة',
      giver: 'مجامل',
      donor: 'متبرع',
      admin: 'مدير',
      acceptTerms: 'أوافق على',
      termsOfUse: 'شروط الاستخدام',
      privacyPolicy: 'سياسة الخصوصية',
      and: 'و',
      createAccount: 'إنشاء حساب',
      loginBtn: 'تسجيل الدخول',
      fillAllFields: 'يرجى ملء جميع الحقول',
      acceptTermsFirst: 'يجب الموافقة على الشروط والخصوصية',
      loginSuccess: 'تم تسجيل الدخول بنجاح',
      registerSuccess: 'تم إنشاء الحساب بنجاح',
      logoutSuccess: 'تم تسجيل الخروج',
      invalidCredentials: 'بيانات الدخول غير صحيحة',
      emailExists: 'البريد الإلكتروني مسجل بالفعل',
      aboutUs: 'من نحن',
      heroTitle: 'جهاز البنات',
      heroSubtitle: 'اختاري أمنياتك.. وشاركيها مع من يحبونك',
      categories: 'التصنيفات',
      all: 'الكل',
      kitchen: 'مطبخ',
      appliances: 'أجهزة',
      bedroom: 'غرفة النوم',
      decor: 'ديكور',
      bathroom: 'حمام',
      clothes: 'ملابس',
      featuredProducts: 'المنتجات المميزة',
      viewAll: 'عرض الكل',
      donateForOrphan: 'تبرع لبنت يتيمة',
      shopNow: 'تسوق الآن',
      products: 'المنتجات',
      myWishlist: 'قائمة أمنياتي',
      emptyWishlist: 'قائمة أمنياتك فارغة',
      startAdding: 'ابدأ بإضافة المنتجات التي تحلمين بها',
      shopNowBtn: 'تسوق الآن',
      itemsInList: 'منتج في القائمة',
      total: 'الإجمالي',
      normalPayment: '💳 الدفع العادي',
      createShareLink: '🔗 إنشاء رابط مشاركة',
      emptyCart: 'عربة التسوق فارغة',
      itemCount: 'عدد المنتجات',
      freeShipping: 'رسول التوصيل',
      free: 'مجاناً',
      continuePayment: 'متابعة الشراء 💳',
      createLinkForGivers: 'إنشاء رابط للمجاملين 🔗',
      selectPayment: 'اختر طريقة الدفع',
      instapay: 'إنستا باي',
      instapayDesc: 'تحويل فوري + رفع سكرين شوت',
      vodafoneCash: 'فودافون كاش',
      vodafoneDesc: 'الدفع عبر فودافون كاش',
      fawry: 'فوري',
      fawryDesc: 'الدفع من أقرب نقطة فوري',
      paypal: 'باي بال',
      paypalDesc: 'الدفع بالدولار أو الجنيه',
      creditCard: 'بطاقة ائتمان',
      creditCardDesc: 'فيزا أو ماستركارد عبر Stripe',
      shippingAddress: 'عنوان الشحن',
      addressPlaceholder: 'العنوان الكامل مع رقم الهاتف...',
      amountToPay: 'المطلوب دفعه',
      uploadScreenshot: 'رفع سكرين شوت الدفع',
      tapToUpload: 'اضغط لرفع صورة الدفع',
      confirmPayment: 'تأكيد الدفع ✓',
      shareYourList: 'اختر صورة للرابط (اختياري)',
      sharedWithYou: 'شاركت قائمة أمنياتها معك 💝',
      clickToPayGift: 'اضغط على المنتجات لدفع ثمنها هدية للعروسة',
      generateLink: '🔗 إنشاء الرابط',
      copyLink: '📋 نسخ الرابط',
      linkCopied: 'تم نسخ الرابط ✓',
      shareInGroups: 'شاركي هذا الرابط في الم.Groups العائلية أو على فيسبوك',
      yourName: 'اسمك (المجامل)',
      yourNamePlaceholder: 'اسمك الكريم',
      idoneDone: 'لقد اكتفيت ✓',
      donateNow: 'تبرع الآن 🤲',
      donateFor: 'تبرع لـ',
      remaining: 'المتبقي',
      amount: 'المبلغ (جنيه)',
      donorName: 'اسمك (اختياري)',
      donorNamePlaceholder: 'اسم المتبرع',
      confirmDonation: 'تأكيد التبرع 💛',
      donationSuccess: 'بارك الله فيك! تم التبرع بنجاح',
      yearsOld: 'سنة',
      donors_count: 'متبرعين',
      requiredProducts: 'المنتجات المطلوبة:',
      buyDirect: 'شراء مباشر 🔗',
      addToCart: 'أضف للسلة 🛒',
      addedToCart: 'تمت الإضافة للسلة ✓',
      alreadyInCart: 'المنتج موجود بالفعل في السلة',
      selectPaymentFirst: 'يرجى اختيار طريقة الدفع',
      enterAddress: 'يرجى إدخال عنوان الشحن',
      enterValidAmount: 'يرجى إدخال مبلغ صحيح',
      addProductsFirst: 'أضيفي منتجات أولاً',
      linkCreated: 'تم إنشاء الرابط ✓',
      thankYouTitle: 'جزاك الله خيراً!',
      thankYouMsg: 'لقد ساهمت في تجهيز عروسة بقلبك الطيب',
      backToHomeBtn: 'العودة لل الرئيسية',
      donateForAnother: 'تبرع لبنت أخرى 🤲',
      ageGate: 'هل أنت أكبر من 18 سنة؟',
      yes: 'نعم',
      no: 'لا',
      tooYoung: 'عذراً، التطبيق مخصص للأشخاص فوق 18 سنة',
      deleteAccount: 'حذف الحساب',
      deleteAccountConfirm: 'هل أنت متأكد من حذف حسابك؟ سيتم حذف جميع بياناتك نهائياً.',
      accountDeleted: 'تم حذف حسابك بنجاح',
      resetPasswordTitle: 'إعادة تعيين كلمة المرور',
      resetPasswordMsg: 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين',
      sendResetLink: 'إرسال رابط إعادة التعيين',
      resetLinkSent: 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني ✓',
      enterEmail: 'يرجى إدخال البريد الإلكتروني',
      correctEmail: 'يرجى إدخال بريد إلكتروني صحيح',
      currency: 'جنيه',
      now: 'الآن',
      minutesAgo: 'منذ {n} دقيقة',
      hoursAgo: 'منذ {n} ساعة',
      daysAgo: 'منذ {n} يوم',
      noNotifications: 'لا توجد إشعارات',
      noOrders: 'لا توجد طلبات بعد',
      pending: 'قيد الانتظار',
      paid: 'مدفوع',
      shipped: 'مشحون',
      myWishlistBtn: 'قائمة أمنياتي',
      myCart: 'عربة التسوق',
      darkMode: 'الوضع الليلي',
      lightMode: 'الوضع النهاري',
      logout: 'تسجيل الخروج',
      adminPanel: 'لوحة الإدارة',
      addProduct: 'إضافة منتج',
      allOrders: 'جميع الطلبات',
      productName: 'اسم المنتج',
      description: 'الوصف',
      price: 'السعر (جنيه)',
      category: 'التصنيف',
      affiliateLink: 'رابط الأفليت',
      mediaLink: 'رابط صورة أو فيديو (اختياري)',
      productIcon: 'أيقونة المنتج',
      addProductBtn: 'إضافة المنتج ✓',
      cancel: 'إلغاء',
      brids: 'العرائس',
      givers: 'المجاملين',
      manageOrders: 'إدارة الطلبات',
      years: 'سنة',
      pageNotFound: 'الصفحة غير موجودة',
    },
    en: {
      appTitle: 'Jihaz Al-Banat 💍',
      home: 'Home',
      wishlist: 'Wishlist',
      donors: 'Donors',
      profile: 'Profile',
      cart: 'Shopping Cart 🛒',
      notifications: 'Notifications 🔔',
      backToHome: 'Home',
      login: 'Login',
      register: 'New Account',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
      fullName: 'Full Name',
      phone: 'Phone Number',
      accountType: 'Account Type',
      bride: 'Bride',
      giver: 'Gift Giver',
      donor: 'Donor',
      admin: 'Admin',
      acceptTerms: 'I agree to the',
      termsOfUse: 'Terms of Use',
      privacyPolicy: 'Privacy Policy',
      and: 'and',
      createAccount: 'Create Account',
      loginBtn: 'Login',
      fillAllFields: 'Please fill all fields',
      acceptTermsFirst: 'You must accept the terms and privacy policy',
      loginSuccess: 'Login successful',
      registerSuccess: 'Account created successfully',
      logoutSuccess: 'Logged out successfully',
      invalidCredentials: 'Invalid login credentials',
      emailExists: 'Email already registered',
      aboutUs: 'About Us',
      heroTitle: 'Jihaz Al-Banat',
      heroSubtitle: 'Choose your wishes.. share them with those who love you',
      categories: 'Categories',
      all: 'All',
      kitchen: 'Kitchen',
      appliances: 'Appliances',
      bedroom: 'Bedroom',
      decor: 'Decor',
      bathroom: 'Bathroom',
      clothes: 'Clothes',
      featuredProducts: 'Featured Products',
      viewAll: 'View All',
      donateForOrphan: 'Donate for an Orphan Girl',
      shopNow: 'Shop Now',
      products: 'Products',
      myWishlist: 'My Wishlist',
      emptyWishlist: 'Your wishlist is empty',
      startAdding: 'Start adding products you dream of',
      shopNowBtn: 'Shop Now',
      itemsInList: 'items in list',
      total: 'Total',
      normalPayment: '💳 Standard Payment',
      createShareLink: '🔗 Create Share Link',
      emptyCart: 'Shopping cart is empty',
      itemCount: 'Items',
      freeShipping: 'Delivery Fee',
      free: 'Free',
      continuePayment: 'Continue Payment 💳',
      createLinkForGivers: 'Create Link for Gift Givers 🔗',
      selectPayment: 'Select Payment Method',
      instapay: 'InstaPay',
      instapayDesc: 'Instant transfer + upload screenshot',
      vodafoneCash: 'Vodafone Cash',
      vodafoneDesc: 'Pay via Vodafone Cash',
      fawry: 'Fawry',
      fawryDesc: 'Pay at nearest Fawry point',
      paypal: 'PayPal',
      paypalDesc: 'Pay in USD or EGP',
      creditCard: 'Credit Card',
      creditCardDesc: 'Visa or Mastercard via Stripe',
      shippingAddress: 'Shipping Address',
      addressPlaceholder: 'Full address with phone number...',
      amountToPay: 'Amount to Pay',
      uploadScreenshot: 'Upload Payment Screenshot',
      tapToUpload: 'Tap to upload payment image',
      confirmPayment: 'Confirm Payment ✓',
      shareYourList: 'Choose an image for the link (optional)',
      sharedWithYou: 'Shared her wishlist with you 💝',
      clickToPayGift: 'Click on products to buy them as gifts for the bride',
      generateLink: '🔗 Generate Link',
      copyLink: '📋 Copy Link',
      linkCopied: 'Link copied ✓',
      shareInGroups: 'Share this link in family groups or on Facebook',
      yourName: 'Your Name (Gift Giver)',
      yourNamePlaceholder: 'Your kind name',
      idoneDone: "I'm Done ✓",
      donateNow: 'Donate Now 🤲',
      donateFor: 'Donate for',
      remaining: 'Remaining',
      amount: 'Amount (EGP)',
      donorName: 'Your Name (optional)',
      donorNamePlaceholder: 'Donor name',
      confirmDonation: 'Confirm Donation 💛',
      donationSuccess: 'May Allah reward you! Donation successful',
      yearsOld: 'years old',
      donors_count: 'donors',
      requiredProducts: 'Required products:',
      buyDirect: 'Buy Direct 🔗',
      addToCart: 'Add to Cart 🛒',
      addedToCart: 'Added to cart ✓',
      alreadyInCart: 'Product already in cart',
      selectPaymentFirst: 'Please select a payment method',
      enterAddress: 'Please enter shipping address',
      enterValidAmount: 'Please enter a valid amount',
      addProductsFirst: 'Add products first',
      linkCreated: 'Link created ✓',
      thankYouTitle: 'Jazak Allah Khair!',
      thankYouMsg: 'You helped prepare a bride with your kind heart',
      backToHomeBtn: 'Back to Home',
      donateForAnother: 'Donate for Another Girl 🤲',
      ageGate: 'Are you over 18 years old?',
      yes: 'Yes',
      no: 'No',
      tooYoung: 'Sorry, this app is for users aged 18+',
      deleteAccount: 'Delete Account',
      deleteAccountConfirm: 'Are you sure you want to delete your account? All your data will be permanently removed.',
      accountDeleted: 'Your account has been deleted',
      resetPasswordTitle: 'Reset Password',
      resetPasswordMsg: 'Enter your email and we will send you a reset link',
      sendResetLink: 'Send Reset Link',
      resetLinkSent: 'Reset link sent to your email ✓',
      enterEmail: 'Please enter your email',
      correctEmail: 'Please enter a valid email',
      currency: 'EGP',
      now: 'Now',
      minutesAgo: '{n} min ago',
      hoursAgo: '{n} hrs ago',
      daysAgo: '{n} days ago',
      noNotifications: 'No notifications',
      noOrders: 'No orders yet',
      pending: 'Pending',
      paid: 'Paid',
      shipped: 'Shipped',
      myWishlistBtn: 'My Wishlist',
      myCart: 'Shopping Cart',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      logout: 'Logout',
      adminPanel: 'Admin Panel',
      addProduct: 'Add Product',
      allOrders: 'All Orders',
      productName: 'Product Name',
      description: 'Description',
      price: 'Price (EGP)',
      category: 'Category',
      affiliateLink: 'Affiliate Link',
      mediaLink: 'Image/Video Link (optional)',
      productIcon: 'Product Icon',
      addProductBtn: 'Add Product ✓',
      cancel: 'Cancel',
      brids: 'Brides',
      givers: 'Gift Givers',
      manageOrders: 'Manage Orders',
      years: 'years',
      pageNotFound: 'Page not found',
    }
  },

  t(key) {
    return this.translations[this.currentLang]?.[key] || this.translations.ar[key] || key;
  },

  toggle() {
    this.currentLang = this.currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('jb_lang', this.currentLang);
    document.documentElement.lang = this.currentLang;
    document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    return this.currentLang;
  },

  isAr() { return this.currentLang === 'ar'; },
  isEn() { return this.currentLang === 'en'; }
};

// Apply saved language on load
document.documentElement.lang = I18N.currentLang;
document.documentElement.dir = I18N.currentLang === 'ar' ? 'rtl' : 'ltr';

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

  // ===== Delete Account =====
  deleteAccount() {
    if (!this.currentUser) return;
    const userId = this.currentUser.id;
    this.users = this.users.filter(u => u.id !== userId);
    this.wishlists = this.wishlists.filter(w => w.userId !== userId);
    this.orders = this.orders.filter(o => o.buyerId !== userId);
    this.cart = [];
    this.currentUser = null;
    this.save('users');
    this.save('wishlists');
    this.save('orders');
    this.save('cart');
    this.save('currentUser');
  },

  // ===== Reset Password (simulated) =====
  resetPassword(email) {
    const user = this.users.find(u => u.email === email);
    if (!user) return { success: false, message: I18N.isAr() ? 'البريد الإلكتروني غير مسجل' : 'Email not registered' };
    // In a real app, this would send an email
    return { success: true };
  },

  // ===== Age Gate =====
  ageVerified: localStorage.getItem('jb_age_verified') === 'true',
  setAgeVerified() {
    this.ageVerified = true;
    localStorage.setItem('jb_age_verified', 'true');
  },
};

// Initialize DB
DB.init();
