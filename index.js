const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middlewares/authMiddleware");
const userapi = require("./apis/userapi");
const categoryapi = require("./apis/categoryapi");
const productapi = require("./apis/productapi");
const orderapi = require("./apis/orderapi");
const notificationapi = require("./apis/notificationapi");
const Ads = require("./apis/adsapi");
const cors = require("cors");
const multer = require("multer");
const { GridFSBucket } = require("mongodb"); // استيراد GridFSBucket بشكل صحيح
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const redis = require("redis");
const client = redis.createClient();
const https = require("https"); // لإرسال طلبات Ping
const  compression =require("compression")

const app = express();
app.use(express.json());
app.use(cors());
app.use(compression());
const PORT = process.env.PORT || 3000;

const serviceAccount = require("./almadian-firebase-adminsdk-3ex6g-6df2997c6f.json");

// تهيئة Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
 
////////////////live ////////////////

// Endpoint لإرسال الإشعار إلى جميع المستخدمين
app.post("/sendNotification", (req, res) => {
  const message = {
    notification: {
      title: req.body.title,
      body: req.body.body,
    },
    topic: "allUsers", // يتم إرسال الإشعار لجميع المستخدمين المسجلين في هذا الموضوع
  };

  // إرسال الإشعار لجميع المستخدمين
  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log("Successfully sent message:", response);
      res.status(200).send("Notification sent successfully!");
    })
    .catch((error) => {
      console.error("Error sending message:", error);
      res.status(500).send("Failed to send notification");
    });
});

notificationapi(app);
// ==========Endpoints========
userapi(app);
categoryapi(app);
productapi(app);
orderapi(app);
Ads(app);
// إعداد Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// رفع الصورة
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const db = mongoose.connection.db; // استخدام اتصال MongoDB
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    // استخدام stream بدلاً من buffer
    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", () => {
      res.status(201).json({
        message: "File uploaded successfully!",
        fileId: uploadStream.id,
        fileUrl: `https://almadina-app-apis.onrender.com/file/${uploadStream.id}`,
      });
    });

    uploadStream.on("error", (err) => {
      res.status(500).json({ error: err.message });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// استرجاع الصورة باستخدام ID
app.get("/file/image/:id", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    // التأكد من استخدام ObjectId بشكل صحيح
    const fileId = new mongoose.Types.ObjectId(req.params.id);

    const downloadStream = bucket.openDownloadStream(fileId);

    downloadStream.pipe(res);

    downloadStream.on("error", (err) => {
      res.status(404).send("File not found.");
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// إعداد الاتصال بقاعدة البيانات MongoDB
const uri = process.env.MONGO_URI ||
  "mongodb+srv://nassar73:amr10299@cluster0.067hm.mongodb.net/mydb?retryWrites=true&w=majority";


  mongoose.connect(uri)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection error:", error));

// مراقبة حالات الاتصال
mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected. Retrying...");
  mongoose.connect(uri);
});

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log('Server is running on port '+PORT);
});
