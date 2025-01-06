const express = require("express");
const app = express();
const Product = require("../models/Product"); // استدعاء موديل المنتج
const mongoose = require("mongoose");


module.exports = (app) => {

// إنشاء منتج جديد (Create)
app.post("/api/products", async (req, res) => {
  try {
    const { name, description, price,unit, discount, category, stock, imageUrl, isFavorite } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      unit,
      discount,
      category,
      stock,
      imageUrl,
      isFavorite,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// الحصول على جميع المنتجات (Read All)
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/products/search', async (req, res) => {
  const { search } = req.query; // استلام قيمة البحث من query parameters

  try {
    const products = await Product.find({
      name: { $regex: search, $options: 'i' }, // البحث باستخدام regex
    });

    res.json(products); // إرسال النتائج كـ JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});


// استرجاع المنتجات بناءً على معرف التصنيف
app.get("/api/products/category/:categoryId", async (req, res) => {
    try {
      const { categoryId } = req.params;
  
      // التحقق من صحة معرف MongoDB
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
  
      // البحث عن المنتجات المرتبطة بالتصنيف
      const products = await Product.find({ category: categoryId });
  
      // التحقق إذا لم يتم العثور على منتجات
      if (products.length === 0) {
        return res.status(404).json({ message: "No products found for this category" });
      }
  
      // إرجاع المنتجات
      res.status(200).json(products);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  });



  app.get("/api/products/categoryname/:categoryName", async (req, res) => {
    try {
      const { categoryName } = req.params;
  
      // البحث عن التصنيف باستخدام الاسم
      const category = await Category.findOne({ name: categoryName });
  
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      // البحث عن المنتجات المرتبطة بالتصنيف
      const products = await Product.find({ category: category._id });
  
      if (products.length === 0) {
        return res.status(404).json({ message: "No products found for this category" });
      }
  
      // إرجاع المنتجات
      res.status(200).json(products);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  });



// الحصول على منتج معين (Read One)
app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("category");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// تحديث منتج (Update)
app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price,unit, discount, category, stock, imageUrl, isFavorite } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price,unit, discount, category, stock, imageUrl, isFavorite },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// حذف منتج (Delete)
app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
};