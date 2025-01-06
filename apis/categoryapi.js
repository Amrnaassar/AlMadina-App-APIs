const express = require("express");
const app = express();
const Category = require("../models/Categories");

module.exports = (app) => {

// إنشاء تصنيف جديد (Create)
app.post("/api/categories", async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;

    const newCategory = new Category({
      name,
      description,
      imageUrl,
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// الحصول على جميع التصنيفات (Read All)
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// الحصول على تصنيف معين (Read One)
app.get("/api/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// تحديث تصنيف (Update)
app.put("/api/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description, imageUrl },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// حذف تصنيف (Delete)
app.delete("/api/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
};
//module.exports = app;
