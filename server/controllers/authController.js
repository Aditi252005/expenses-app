const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { validateSignup, validateLogin } = require("../utils/validators");

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

// Strip password (and anything else internal) before sending user to client.
function toPublicUser(user) {
  return { id: user._id, name: user.name, email: user.email };
}

async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const errors = validateSignup({ name, email, password });
    if (errors.length) {
      return res.status(400).json({ msg: errors[0], errors });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ msg: "Account already exists. Please login." });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({ name: name.trim(), email, password: hashed });

    res.status(201).json({ msg: "User created successfully" });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const errors = validateLogin({ email, password });
    if (errors.length) {
      return res.status(400).json({ msg: errors[0], errors });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    const token = signToken(user._id);

    res.json({ token, user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login, me };
