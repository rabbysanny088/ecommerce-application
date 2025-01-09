import dotenv from "dotenv";
import express from "express";
const app = express();
dotenv.config();

// const cors = require("cors");
import cookieParser from "cookie-parser";
import path from "path";
import connectDB from "./lib/db/connection.js";
import analyticsRoutes from "./routes/analytics.route.js";
import authRoutes from "./routes/auth.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentsRoutes from "./routes/payment.route.js";
import productRoutes from "./routes/product.route.js";

const PORT = process.env.PORT || 5000;

// app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "100mb" }));
const __dirnames = path.resolve();

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/analytics", analyticsRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirnames, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirnames, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  connectDB();
});
