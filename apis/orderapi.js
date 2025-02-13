const express = require("express");
const app = express();
const Product = require("../models/Orders"); // استدعاء موديل المنتج
const Order = require("../models/Orders");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const nodemailer = require("nodemailer");

module.exports = (app) => {

  app.post("/api/orders", async (req, res) => {
    try {
      const { userId, products, totalPrice, userAddress, userPhone } = req.body;

      const newOrder = new Order({
        userId,
        products,
        totalPrice,
        userAddress,
        userPhone,
      });
      
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
            to: "almadinamarket102@gmail.com",
            subject: "New order",
            text: `New order User ID : ${userId}
             User phone : ${userPhone}
             Order Adress : ${userAddress}
             Total price : ${totalPrice}`,
          });

      const savedOrder = await newOrder.save();
      res.status(201).json(savedOrder);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // الحصول على جميع الطلبات (Get All Orders)
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await Order.find().populate("products.productId");
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // الحصول على جميع الطلبات الخاصة بمستخدم معين باستخدام التوكن
  
  app.get("/api/orders/user", async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Authorization token is required" });
      }
  
      let decodedToken;
      try {
        decodedToken = jwt.verify(token, JWT_SECRET);
      } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
  
      const userId = decodedToken.userId;
      const userOrders = await Order.find({ userId }).populate("products.productId");
  
      if (!userOrders || userOrders.length === 0) {
        return res.status(404).json({ message: "No orders found for this user" });
      }
  
      res.status(200).json(userOrders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  


  // الحصول على طلب معين بواسطة ID (Get Order by ID)
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const order = await Order.findById(id).populate("products.productId");

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // تحديث حالة الطلب (Update Order Status)
  app.put("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // حذف طلب (Delete Order)
  app.delete("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const deletedOrder = await Order.findByIdAndDelete(id);

      if (!deletedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  app.put("/api/orders/:orderId/status", async (req, res) => {
    try {
        const { status } = req.body; // الحالة الجديدة من الطلب
        const { orderId } = req.params;

        // التحقق من صحة الحالة
        if (!["pending", "completed", "cancelled"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        // تحديث الطلب
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order status updated", order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


};