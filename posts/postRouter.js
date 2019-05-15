const express = require("express");

const Posts = require("./postDb.js");

const router = express.Router();

// Can use this because the server.js is defining the default route that grabs the posts

// /api/posts
router.get("/", async (req, res) => {
  try {
    const posts = await Posts.get(req.query);
    res.status(200).json(posts);
  } catch (error) {
    //log error to server
    console.log(error);
    res.status(500).json({
      message: "Error receiving the posts."
    });
  }
});

// /api/posts/:id
router.get("/:id", validatePostId, async (req, res) => {
  res.status(200).json(req.post);
});

// /api/posts/:id
router.delete("/:id", validatePostId, async (req, res) => {
  try {
    const count = await Posts.remove(req.params.id);
    if (count > 0) {
      res.status(200).json({
        message: "The post is gone, but the internet will always remember"
      });
    } else {
      res.status(404).json({ message: "The post could not be found" });
    }
  } catch (error) {
    //log error to server
    console.log(error);
    res.status(500).json({ message: "Error removing the post." });
  }
});

router.put("/:id", validatePostId, async (req, res) => {
  try {
    const post = await Posts.update(req.params.id, req.body);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "The post could not be found" });
    }
  } catch (error) {
    // log error to the server
    console.log(error);
    res.status(500).json({ message: "Error updating the post!" });
  }
});

// custom middleware

async function validatePostId(req, res, next) {
  try {
    const { id } = req.params;
    const post = await Posts.getById(id);
    if (post) {
      req.post = post;
      next();
    } else {
      res.status(404).json({ message: "Error -- Post not found!" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error -- Erasing Hard Drive" });
  }
}

module.exports = router;
