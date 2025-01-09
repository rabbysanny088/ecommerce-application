import express from "express";

import {
  handleGetProfile,
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleSignup,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/authProtect.middleware.js";

const router = express.Router();

router.post("/signup", handleSignup);

router.post("/login", handleLogin);
router.post("/logout", handleLogout);
router.post("/refresh-token", handleRefreshToken);
router.get("/profile", protectedRoute, handleGetProfile);

export default router;
