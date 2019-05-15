const express = require("express");

const Posts = require("./postDb.js");

const router = express.Router();

// Can use this because the server.js is defining the default route that grabs the posts
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

router.get("/:id", (req, res) => {});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

// custom middleware

function validatePostId(req, res, next) {}

module.exports = router;
