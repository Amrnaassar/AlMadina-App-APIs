const express = require("express");
const app = express();
const Advertisement = require("../models/ads");
const Product = require("../models/Product"); // لربط الإعلانات بالمنتجات

module.exports = (app) => {
// إنشاء إعلان جديد
app.post("/api/ads", async (req, res) => {
  try {
    const { product, title} = req.body;

    // التحقق من وجود المنتج المرتبط
    const existingProduct = await Product.findById(product);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newAd = new Advertisement({ product, title});
    const savedAd = await newAd.save();
    res.status(201).json(savedAd);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// الحصول على جميع الإعلانات
app.get("/api/ads", async (req, res) => {
  try {
    const ads = await Advertisement.find().populate("product");
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// الحصول على إعلان معين
app.get("/api/ads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Advertisement.findById(id).populate("product");

    if (!ad) {
      return res.status(404).json({ message: "Advertisement not found" });
    }

    res.status(200).json(ad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// تحديث إعلان
app.put("/api/ads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const updatedAd = await Advertisement.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    );

    if (!updatedAd) {
      return res.status(404).json({ message: "Advertisement not found" });
    }

    res.status(200).json(updatedAd);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// حذف إعلان
app.delete("/api/ads/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAd = await Advertisement.findByIdAndDelete(id);

    if (!deletedAd) {
      return res.status(404).json({ message: "Advertisement not found" });
    }

    res.status(200).json({ message: "Advertisement deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

}