// استيراد مكتبة Firebase Admin SDK
const admin = require('firebase-admin');

// مسار مفتاح الخدمة الذي قمت بتحميله (يجب أن يكون لديك الملف json الذي يحتوي على المفتاح الخاص بك)
const serviceAccount = require('almadian-firebase-adminsdk-3ex6g-6df2997c6f.json');

// تهيئة Firebase Admin باستخدام المفتاح الخاص
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// الآن يمكنك استخدام Firebase Admin SDK لإرسال إشعارات.
