const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { dbIsConnected } = require("../config/db");
const { JWT_SECRET } = require("../middleware/authMiddleware");

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

const DEMO_ACCOUNTS = {
  farmer: { id: "demo-farmer", name: "Demo Farmer", email: "farmer@demo.bhoomi-drishti", role: "farmer" },
  officer: { id: "demo-officer", name: "Demo Officer", email: "officer@demo.bhoomi-drishti", role: "officer" }
};

async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "name, email and password are required" });
    }
    if (!dbIsConnected()) {
      return res.status(503).json({
        success: false,
        message: "Registration requires a database connection. Try 'Continue with Demo Account' instead."
      });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ success: false, message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: role === "officer" ? "officer" : "farmer" });
    const token = signToken({ id: user._id, name: user.name, role: user.role });

    return res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "email and password are required" });
    }
    if (!dbIsConnected()) {
      return res.status(503).json({
        success: false,
        message: "Login requires a database connection. Try 'Continue with Demo Account' instead."
      });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = signToken({ id: user._id, name: user.name, role: user.role });
    return res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// Works with or without a database, so SIH judges can always get in.
async function demoLogin(req, res) {
  const role = req.body.role === "officer" ? "officer" : "farmer";
  const account = DEMO_ACCOUNTS[role];
  const token = signToken({ id: account.id, name: account.name, role: account.role });
  return res.json({ success: true, token, user: account, demo: true });
}

module.exports = { register, login, demoLogin };
