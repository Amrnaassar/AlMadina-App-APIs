const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  address: { type: String, required: false }, // العنوان
  phone: { type: String, required: true,unique: true },   // رقم الهاتف
  dateOfBirth: { type: Date, required: false }, // تاريخ الميلاد
  gender: { type: String, enum: ["Male", "Female", "Other"], required: false }, // الجنس
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // المنتجات المفضلة
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
