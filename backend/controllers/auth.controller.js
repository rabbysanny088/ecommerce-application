import jwt from "jsonwebtoken";
import generateTokens from "../lib/generateTokens.js";
import redis from "../lib/redis.js";
import setCookies from "../lib/setCookies.js";
import storeRefreshToken from "../lib/storeRefreshToken.js";
import User from "../models/user.model.js";

const handleSignup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);
    return res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "User created successfully",
    });
  } catch (error) {
    console.log("error in handleSignup", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id);
      await storeRefreshToken(user._id, refreshToken);
      setCookies(res, accessToken, refreshToken);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("error in handleLogin", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const handleLogout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh_token:${decoded.userId}`);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("error in handleLogout", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// recreateToken
const handleRefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized! NO token provided" });
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);
    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("error in handleAccessToken", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// user profile

const handleGetProfile = async (req, res) => {
  try {
    return res.json(req.user);
  } catch (error) {
    console.log("Error in handleGetProfile", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
export {
  handleGetProfile,
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleSignup,
};
