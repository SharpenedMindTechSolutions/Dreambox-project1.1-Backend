import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  submitContactForm,
} from "../Controller/authcontroller.js";

const router = express.Router();

// user authentication routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/contactform", submitContactForm);

export default router;
