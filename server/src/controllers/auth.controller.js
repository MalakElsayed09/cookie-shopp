// server/src/controllers/authController.js
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { sendMail } from "../utils/mailer.js";

const sign = (user) =>
  jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });

function makeVerifyToken() {
  return crypto.randomBytes(32).toString("hex");
}

// POST /api/auth/register
export async function register(req, res) {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email in use" });

  const verificationToken = makeVerifyToken();
  const user = await User.create({
    name,
    email,
    password,
    isVerified: false,
    verificationToken,
    verificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
  });

  const verifyUrl = `${process.env.CLIENT_ORIGIN}/verify-email?token=${verificationToken}`;
try{
  await sendMail({
    to: user.email,
    subject: "Verify your CookieShop account",
    html: `
      <p>Hi ${user.name},</p>
      <p>Verify your email to activate your account:</p>
      <p><a href="${verifyUrl}" target="_blank" rel="noreferrer">Verify Email</a></p>
      <p>This link expires in 24 hours.</p>
    `,
  });
}catch(err){
    console.warn("sendMail error (proceeding without email):", err?.message || err);
  console.log("Verify link (manual):", verifyUrl);
}
  // IMPORTANT: do NOT set the login cookie here. Wait for verification.
  return res.status(201).json({ message: "Registered. Check your email to verify your account." });
}

// GET /api/auth/verify?token=...
export async function verifyEmail(req, res) {
  const { token } = req.query;
  if (!token) return res.status(400).json({ message: "Missing token" });

  const user = await User.findOne({
    verificationToken: token,
    verificationExpires: { $gt: new Date() },
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationExpires = undefined;
  await user.save();

  const jwtToken = sign(user);
  return res
    .cookie("token", jwtToken, { httpOnly: true, sameSite: "lax", secure: false })
    .json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}

// POST /api/auth/resend-verification
export async function resendVerification(req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "No account with that email" });
  if (user.isVerified) return res.status(400).json({ message: "Already verified" });

  const verificationToken = makeVerifyToken();
  user.verificationToken = verificationToken;
  user.verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save();

  const verifyUrl = `${process.env.CLIENT_ORIGIN}/verify-email?token=${verificationToken}`;
  await sendMail({
    to: user.email,
    subject: "Verify your CookieShop account (resend)",
    html: `
      <p>Hi ${user.name},</p>
      <p>Click to verify your email:</p>
      <p><a href="${verifyUrl}" target="_blank" rel="noreferrer">Verify Email</a></p>
    `,
  });

  return res.json({ message: "Verification email resent" });
}

// POST /api/auth/login
export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  if (!user.isVerified) {
    return res.status(403).json({ message: "Please verify your email before logging in." });
  }

  const token = sign(user);
  return res
    .cookie("token", token, { httpOnly: true, sameSite: "lax", secure: false })
    .json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}

// GET /api/auth/me (requires requireAuth)
export async function me(req, res) {
  const user = await User.findById(req.user.id).select("-password");
  return res.json({ user });
}

// POST /api/auth/logout
export function logout(_req, res) {
  return res.clearCookie("token", { sameSite: "lax", secure: false }).json({ ok: true });
}
