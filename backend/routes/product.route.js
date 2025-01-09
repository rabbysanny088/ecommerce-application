import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getRecommendedProduct,
  toggleFeaturedProduct,
} from "../controllers/product.controller.js";
import {
  adminRoute,
  protectedRoute,
} from "../middleware/authProtect.middleware.js";
const router = express.Router();

router.get("/", protectedRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendedProduct);
router.post("/", protectedRoute, adminRoute, createProduct);
router.patch("/:id", protectedRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id", protectedRoute, adminRoute, deleteProduct);

export default router;
