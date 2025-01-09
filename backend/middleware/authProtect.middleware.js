import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectedRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized  - No access token provided" });
    }
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.userId).select("-password");
      if (!user) {
        return res
          .status(401)
          .json({ message: "Unauthorized - User not found" });
      }
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Unauthorized - Access Token expired" });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.log("error in protectedRoute", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const adminRoute = async (req, res, next) => {
  try {
    if (req.user.role === "admin") {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Access denied - Admin can only access!" });
    }
  } catch (error) {
    console.log("error in adminRoute", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export { adminRoute, protectedRoute };
