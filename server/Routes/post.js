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

// @route GET api/posts
// @desc Get posts
// @access Private

router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId }).populate("user", [
      "username",
    ]);
    res.json({ success: true, posts });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Internal server error", success: false });
  }
});

// @route PUT api/posts
// @desc Create posts
// @access Private

router.put("/:id", verifyToken, async (req, res) => {
  const { title, description, status } = req.body;

  // Simple validation
  if (!title) {
    return res
      .status(400)
      .json({ success: false, message: "Title is required" });
  }

  try {
    let updatePost = {
      title,
      description: description || "",
      status: status || "To Do",
    };
    const postUpdateCondition = { _id: req.params.id, user: req.userId };
    updatePost = await Post.findOneAndUpdate(postUpdateCondition, updatePost, {
      new: true,
    });

    if (!updatePost) {
      return res
        .status(401)
        .json({ success: false, message: "Post not found" });
    }

    res.json({ success: true, message: "Update Success" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Server internal error" });
  }
});

// @route DELETE api/posts
// @desc Delete posts
// @access Private

router.delete("/:id", verifyToken, async (req, res) => {
  const { title, description, status } = req.body;

  // Simple validation

  try {
    const postDeleteCondition = { _id: req.params.id, user: req.userId };
    const deletePost = await Post.findOneAndDelete(postDeleteCondition);

    if (!deletePost) {
      return res
        .status(401)
        .json({ success: false, message: "Post not found" });
    }

    res.json({ success: true, message: "Delete Success" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Server internal error" });
  }
});

module.exports = router;
