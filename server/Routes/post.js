const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Post = require("../models/Post");

// @route POST api/posts
// @desc Create posts
// @access Private

router.post("/", verifyToken, async (req, res) => {
  const { title, description, status } = req.body;

  // Simple validation
  if (!title) {
    return res
      .status(400)
      .json({ success: false, message: "Title is required" });
  }

  try {
    const newPost = new Post({
      title,
      description,
      status: status || "To Do",
      user: req.userId,
    });
    await newPost.save();
    res.json({ success: true, message: "Create Successfully", post: newPost });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Server internal error" });
  }
});

module.exports = router;
