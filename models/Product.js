const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true },
  unit: { type: String, required: true },
  discount: { type: Number, required: false },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  stock: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  isFavorite: { type: Boolean, default: false }, // هل المنتج مفضل
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
