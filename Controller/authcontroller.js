import User from "../Model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import ContactMessage from "../Model/ContactMessage.js";
import dotenv from "dotenv";
dotenv.config();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Register controller
export const registerUser = async (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body;

  if (!name || !email || !phone || !password || !confirmPassword) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ msg: "Passwords do not match" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ msg: "Email already registered" });

  const user = await User.create({ name, email, phone, password });
  const token = generateToken(user._id);

  res.status(201).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
    token,
    msg: "Successfully Registered",
  });
};

// Login controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ msg: "Email and password required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Invalid email or password" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ msg: "Invalid email or password" });

  const token = generateToken(user._id);

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
    token,
    msg: "Successfully login ",
  });
};

//forgotPassword controller

// --- FORGOT PASSWORD ---
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: "Email is required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User not found" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
  await user.save();
  const resetLink = `${process.env.CLIENT_lIVE_URL}/reset-password/${token}`;
  const html = `
    <div style="font-family: Arial; max-width: 600px; margin: auto; padding: 24px; background-color: #f9f9f9; border-radius: 8px; border: 1px solid #ddd;">
      <h2>🔐 Reset Your Password</h2>
      <p>Hello,</p>
      <p>We received a request to reset your password. Click the button below. This link is valid for 15 minutes.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #007BFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Reset Password
        </a>
      </div>
      <p>If you didn’t request this, you can ignore this email.</p>
    </div>
  `;

  await sendEmail(user.email, "Reset Password Link", html);
  res.json({ msg: "Password reset link sent to email" });
};

// --- RESET PASSWORD ---
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.id,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    return res.status(400).json({ msg: "Invalid or expired token" });
  }
};

// -------------------- contact message -------------------------------
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newMessage = new ContactMessage({ name, email, message });
    await newMessage.save();

    res
      .status(200)
      .json({ success: true, message: "Message submitted successfully!" });
  } catch (error) {
    console.error("Contact Form Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
