const express = require("express");
const argon2 = require("argon2");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = express.Router();

// @route Post api/auth/register
// @desc Register User
// @access Public

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  //Simple validation
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Bad Request. Missing username or password",
    });
  }
  try {
    // Check for existing user
    const user = await User.findOne({ username });
    if (user) {
      return res
        .status(400)
        .json({ susscess: false, message: "User already exits" });
    }

    //All good
    const hasedPassword = await argon2.hash(password);
    const newUser = new User({
      username,
      password: hasedPassword,
    });
    await newUser.save();

    // Return Token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      success: true,
      message: "User created successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route Post api/auth/login
// @desc Login User
// @access Public

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Validation
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Bad Request. Missing username or password",
    });
  }

  try {
    // Check for existing user
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ sucess: false, message: "Incorrect username" });
    }

    // Username found
    const passwordVerified = await argon2.verify(user.password, password);
    if (!passwordVerified) {
      return res
        .status(400)
        .json({ sucess: false, message: "Incorrect password" });
    }
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      success: true,
      message: "Login successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
