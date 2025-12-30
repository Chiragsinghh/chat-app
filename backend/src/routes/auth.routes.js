import express from "express";
import {
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// auth
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// 🔑 THIS IS THE MISSING PIECE
router.get("/check", protectRoute, (req, res) => {
  res.status(200).json(req.user);
});

// profile
router.put("/update-profile", protectRoute, updateProfile);

export default router;
