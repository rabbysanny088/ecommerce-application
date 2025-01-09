import express from "express";
import {
  addToCart,
  getCartProducts,
  removeAllFromCart,
  updateQuantity,
} from "../controllers/cart.controller.js";
import { protectedRoute } from "../middleware/authProtect.middleware.js";
const router = express.Router();

router.get("/", protectedRoute, getCartProducts);
router.post("/", protectedRoute, addToCart);
router.delete("/", protectedRoute, removeAllFromCart);
router.put("/:id", protectedRoute, updateQuantity);

export default router;
