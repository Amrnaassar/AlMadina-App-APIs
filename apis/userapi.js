const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/user");
const { JWT_SECRET } = require("../config");

const nodemailer = require("nodemailer");
const speakeasy = require("speakeasy");
let otpStore = {}; 

module.exports = (app) => {
  // إضافة مستخدم جديد (Create)
  app.post("/api/users/register", async (req, res) => {
    try {
      const { name, email, password, phone, address, dateOfBirth, gender } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        dateOfBirth,
        gender,
      });

      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // تسجيل الدخول للمستخدم (Login)
  
  app.post("/api/users/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }
  
      const token = jwt.sign({ userId: user._id }, JWT_SECRET); // مدة الصلاحية اختيارية
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

///////////////OTP///////////////////////////////

app.post("/api/users/register/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    // التحقق إذا كان البريد الإلكتروني مسجل بالفعل
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    // توليد رمز OTP باستخدام speakeasy
    const otp = speakeasy.totp({
      secret: speakeasy.generateSecret({ length: 20 }).base32, // إنشاء سر عشوائي لكل مستخدم
      encoding: "base32",
    });

    // تخزين OTP مع الطابع الزمني (10 دقائق صلاحية)
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

    // إعداد البريد الإلكتروني
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "alfanarofficial102@gmail.com", // بريد المرسل
        pass: "czpq ivco hmgr acjv",     // استخدام كلمة مرور التطبيق
      },
    });

    // إرسال البريد الإلكتروني
    await transporter.sendMail({
      from: "alfanarofficial102@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending OTP: " + error.message });
  }
});


  // التحقق من OTP وإتمام التسجيل
  app.post("/api/users/register/verify-otp", async (req, res) => {
    try {
      const { email, otp } = req.body;
  
      if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
      }
  
      const storedOtp = otpStore[email];
      if (!storedOtp) {
        return res.status(400).json({ message: "OTP expired or not requested" });
      }
  
      if (storedOtp.expires < Date.now()) {
        delete otpStore[email];
        return res.status(400).json({ message: "OTP has expired" });
      }
  
      if (otp === storedOtp.otp) {
        delete otpStore[email];
        return res.status(200).json({ message: "OTP is correct" });
      } else {
        return res.status(400).json({ message: "Invalid OTP" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  // الحصول على تفاصيل المستخدم (Read - Get Profile)
  app.get("/api/users/profile", authMiddleware, async (req, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized: No userId found in token" });
      }
  
      const user = await User.findById(req.userId).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching profile:", error.message);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });
  

  // تحديث بيانات المستخدم (Update)
  app.put("/api/users/update", authMiddleware, async (req, res) => {
    try {
      const { name, email, phone, address, dateOfBirth, gender } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        { name, email, phone, address, dateOfBirth, gender },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // حذف حساب المستخدم (Delete)
  app.delete("/api/users/delete", authMiddleware, async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.userId);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // عرض العناصر المفضلة
 app.get("/api/users/favorites", authMiddleware, async (req, res) => {
  try {
    console.log("User ID:", req.userId);
    const user = await User.findById(req.userId).populate("favorites");
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }
    console.log("Favorites:", user.favorites);
    res.status(200).json(user.favorites);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
});

  // إضافة منتج إلى المفضلة
  app.put("/api/users/favorites/add", authMiddleware, async (req, res) => {
    try {
      const { productId } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        { $addToSet: { favorites: productId } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // إزالة منتج من المفضلة
  app.put("/api/users/favorites/remove", authMiddleware, async (req, res) => {
    try {
      const { productId } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        { $pull: { favorites: productId } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


  // إرسال OTP لتغيير كلمة المرور
app.post("/api/users/password-reset/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = speakeasy.totp({
      secret: speakeasy.generateSecret({ length: 20 }).base32,
      encoding: "base32",
    });

    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "alfanarofficial102@gmail.com",
        pass: "czpq ivco hmgr acjv", // كلمة مرور التطبيق
      },
    });

    await transporter.sendMail({
      from: "alfanarofficial102@gmail.com",
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending OTP: " + error.message });
  }
});
// التحقق من صحة OTP فقط
app.post("/api/users/password-reset/validate-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        status: "error",
        message: "Email and OTP are required"
      });
    }

    const storedOtp = otpStore[email];
    if (!storedOtp) {
      return res.status(400).json({
        status: "error",
        message: "OTP expired or not requested"
      });
    }

    if (storedOtp.expires < Date.now()) {
      delete otpStore[email];
      return res.status(400).json({
        status: "error",
        message: "OTP has expired"
      });
    }

    if (otp === storedOtp.otp) {
      return res.status(200).json({
        status: "success",
        message: "OTP is valid"
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Invalid OTP"
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
});



// التحقق من OTP وتغيير كلمة المرور
app.post("/api/users/password-reset/reset", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    const storedOtp = otpStore[email];
    if (!storedOtp) {
      return res.status(400).json({ message: "OTP expired or not requested" });
    }

    if (storedOtp.expires < Date.now()) {
      delete otpStore[email];
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (otp !== storedOtp.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // حذف OTP بعد الاستخدام
    delete otpStore[email];

    // تحديث كلمة المرور
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error resetting password: " + error.message });
  }
});


};
