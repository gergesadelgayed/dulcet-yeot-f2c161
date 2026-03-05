# EL FLA7EN Cyber Security Team — Website

## 🚀 Quick Start

### 1. Firebase Setup (مجاني)
1. اذهب إلى [firebase.google.com](https://firebase.google.com)
2. أنشئ مشروعاً جديداً (مجاني)
3. فعّل **Realtime Database** أو **Firestore**
4. افتح `assets/js/main.js` وضع بيانات Firebase الخاصة بك في `firebaseConfig`
5. في قواعد Realtime Database، ضع:
```json
{
  "rules": {
    ".read": true,
    ".write": "auth != null"
  }
}
```

### 2. Firebase Hosting (للنشر)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### 3. GitHub Pages (بديل مجاني)
1. ارفع كل الملفات إلى GitHub repo
2. فعّل GitHub Pages من Settings → Pages
3. اختر main branch كمصدر

### 4. Netlify (أسهل بديل مجاني)
1. اذهب إلى [netlify.com](https://netlify.com)
2. اسحب وأفلت مجلد المشروع على Netlify
3. يتم النشر فوراً!

---

## 📁 Project Structure
```
elfla7en/
├── index.html              ← الصفحة الرئيسية
├── team.html               ← صفحة الفريق
├── join.html               ← نموذج الانضمام
├── login.html              ← تسجيل الدخول
├── dashboard.html          ← لوحة العضو
├── writeups.html           ← Writeups
├── achievements.html       ← الإنجازات
├── admin/
│   ├── panel.html          ← لوحة الأدمن
│   ├── add-member.html     ← إضافة عضو
│   └── edit-member.html    ← تعديل عضو
└── assets/
    ├── css/main.css        ← الستايل الرئيسي
    └── js/main.js          ← JavaScript + Firebase
```

---

## 🔐 Admin Credentials
- **URL:** `/admin/panel.html`
- **Email:** `admin@elfla7en.ctf`
- **Password:** `anafla7$`

---

## ⚙️ Features
- ✅ Dark Web aesthetic design
- ✅ Matrix rain animation  
- ✅ Firebase Realtime Database integration
- ✅ Local fallback data (works without Firebase)
- ✅ Admin panel with full CRUD
- ✅ Join form with multi-step wizard
- ✅ Writeups with file upload UI
- ✅ Achievements in cards + timeline views
- ✅ Member filtering by specialty
- ✅ Session-based authentication
- ✅ Responsive design
- ✅ Monospace / Orbitron fonts
- ✅ Purple glow effects

---

## 🛠️ Customization
To add Firebase Auth properly, enable Email/Password auth in Firebase Console
and update the `loginMember()` function in `assets/js/main.js`.

For file uploads (Writeups PDFs), integrate **Firebase Storage** and update
the upload zone handler in `writeups.html`.
