# 💍 جهاز البنات - Girls' Trousseau Platform

منصة ذكية لهدايا الزواج عبر روابط الأفليت - تطبيق PWA متوافق مع Google Play و App Store

## 📱 المميزات

### 4 أنواع حسابات:
1. **👰 العروسة** - تختار المنتجات وتضعها في قائمة أمنياتها
2. **🎁 المجامل** - يدخل عبر الرابط ويشتري هدايا للعروسة
3. **🤲 المتبرع** - يتبرع لقوائم فتيات يتيمات
4. **⚙️ المدير (الادمن)** - يضيف المنتجات وروابط الأفليت

### طرق الدفع:
- 📸 إنستا باي
- 📱 فودافون كاش
- 🏪 فوري
- 💳 باي بال
- 💎 Stripe (بطاقات ائتمان)

### الميزات الرئيسية:
- ✅ قائمة أمنيات قابلة للمشاركة
- ✅ رابط مخصص بصورة العروسة
- ✅ رفع سكرين شوت الدفع
- ✅ نظام تبرع للفتيات اليتمات
- ✅ إشعارات فورية لكل عملية شراء
- ✅ لوحة تحكم إدارية
- ✅ تصميم عربي RTL كامل
- ✅ PWA - يعمل بدون إنترنت
- ✅ توافق مع متاجر التطبيقات

## 🚀 التشغيل المحلي

```bash
cd jihaz-albanat
npx serve . -l 3000
```

ثم افتح: http://localhost:3000

## 📦 الت packaging لل Android (Google Play)

### المتطلبات:
- Node.js 18+
- Android Studio
- JDK 17+

### الخطوات:

```bash
# 1. تثبيت التبعيات
npm install

# 2. إضافة Android
npx cap add android

# 3. نسخ الملفات
npx cap copy

# 4. فتح Android Studio
npx cap open android
```

### في Android Studio:
1. Build → Generate Signed Bundle/APK
2. اختر Android App Bundle (AAB) للنشر على Play Store
3. اتبع خطوات التوقيع

### متطلبات Google Play:
- ✅ Privacy Policy URL (مطلوب)
- ✅ Content Rating
- ✅ Target API Level 33+
- ✅ 64-bit support (مدعوم تلقائياً)
- ✅ App Bundle format

## 🍎 الت packaging لل iOS (App Store)

### المتطلبات:
- macOS
- Xcode 14+
- Apple Developer Account ($99/سنة)

### الخطوات:

```bash
# 1. تثبيت التبعيات
npm install

# 2. إضافة iOS
npx cap add ios

# 3. نسخ الملفات
npx cap copy

# 4. فتح Xcode
npx cap open ios
```

### في Xcode:
1. اختر Team في Signing & Capabilities
2. Product → Archive
3. Distribute App → App Store Connect

### متطلبات App Store:
- ✅ Privacy Policy URL
- ✅ App Privacy Details
- ✅ Age Rating
- ✅ Screenshots (6.5", 5.5", iPad)
- ✅ App Icon (1024x1024)

## 📁 هيكل المشروع

```
jihaz-albanat/
├── index.html           # الصفحة الرئيسية (SPA)
├── css/
│   └── style.css        # التنسيقات (RTL كامل)
├── js/
│   ├── data.js          # طبقة البيانات والتخزين
│   └── app.js           # منطق التطبيق والواجهات
├── assets/
│   └── icons/           # أيقونات التطبيق
├── manifest.json        # PWA Manifest
├── sw.js                # Service Worker
├── capacitor.config.json # إعداد Capacitor
├── package.json         # تبعيات المشروع
└── README.md            # هذا الملف
```

## 🔐 أمان التطبيق

- جميع البيانات محفوظة محلياً (localStorage)
- لا يتم إرسال أي بيانات حساسة لخوادم خارجية
- روابط الأفليت تفتح في متصفح خارجي
- التطبيق يعمل كـ PWA آمن عبر HTTPS

## 📝 ملاحظات للنشر

### Google Play Store:
1. أنشئ حساب مطور ($25 لمرة واحدة)
2. استخدم AAB (Android App Bundle)
3. أضف Privacy Policy (مطلوب لجمع الصور)
4. حدد Content Rating بدقة
5. أضف screenshots بمقاسات متعددة

### Apple App Store:
1. أنشئ حساب مطور ($99/سنة)
2. استخدم Xcode للـ Archive
3. Privacy Policy URL مطلوب
4. App Privacy section مطلوب في App Store Connect
5. تأكد من أن التطبيق لا يجمع بيانات مستخدم حساسة بدون إذن

### التحديثات:
```bash
# تحديث الكود
npx cap copy

# تحديث plugins
npx cap update
```

## 💡 التخصيص

### إضافة بوابة دفع حقيقية:
- عدّل `js/data.js` لربط API الدفع
- أضف WebView handlers في Capacitor plugins

### إضافة Firebase:
```bash
npm install @capacitor-firebase/app
npm install @capacitor-firebase/messaging  # للإشعارات
```

### إضافة Backend:
- يمكن ربط التطبيق مع Firebase, Supabase, أو API خاص
- البيانات حالياً محلية (localStorage)

## 📄 الترخيص

MIT License
