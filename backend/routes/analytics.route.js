import express from "express";
import {
  getAnalyticsData,
  getDailySalesData,
} from "../controllers/analytics.controller.js";
import {
  adminRoute,
  protectedRoute,
} from "../middleware/authProtect.middleware.js";

const router = express.Router();

router.get("/", protectedRoute, adminRoute, async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData();
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dailySalesData = await getDailySalesData(startDate, endDate);

    return res.status(200).json({
      analyticsData,
      dailySalesData,
    });
  } catch (error) {
    console.log(
      "Error in getAnalyticsData and getDailySalesData",
      error.message
    );
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

export default router;
