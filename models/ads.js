const mongoose = require("mongoose");

const adsSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // الربط بمنتج
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, // تاريخ الإضافة
});

module.exports = mongoose.model("Ads", adsSchema);
