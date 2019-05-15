const express = require("express");

const Users = require("./userDb.js");
const Posts = require("../posts/postDb.js");

const router = express.Router();

// Can use this because the server.js is defining this default route that grabs the users

// /api/users
router.get("/", async (req, res) => {
  try {
    const users = await Users.get(req.body);
    res.status(200).json(users);
  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({ message: "Error retreiving the Users" });
  }
});

// /api/users/:id
router.get("/:id", validateUserId, async (req, res) => {
  res.status(200).json(req.user);
});

// /api/users
router.post("/", validateUser, async (req, res) => {
  try {
    const user = await Users.insert(req.body);
    res.status(201).json(user);
  } catch (error) {
    // console log error
    console.log(error);
    res.status(500).json({ message: "Error creating a user. Nice work." });
  }
});

router.post("/:id/posts", validateUserId, validatePost, async (req, res) => {
  const postData = { ...req.body, user_id: req.params.id };
  try {
    const post = await Posts.insert(postData);
    res.status(201).json(post);
  } catch (error) {
    // log error to the server
    console.log(error);
    res.status(500).json({ message: "Error -- Cannot create post" });
  }
});

router.get("/:id/posts", validateUserId, async (req, res) => {
  try {
    const posts = await Users.getUserPosts(req.params.id);
    res.status(200).json(posts);
  } catch (error) {
    // log error to the server
    console.log(error);
    res.status(500).json({ message: "Error -- Cannot get posts by user" });
  }
});

router.delete("/:id", validateUserId, async (req, res) => {
  try {
    const count = await Users.remove(req.params.id);
    if (count > 0) {
      res
        .status(200)
        .json({
          message:
            "The user has been removed, but the internet will always remember"
        });
    } else {
      res.status(404).json({ message: "That's not a real user, genius!" });
    }
  } catch (error) {
    // log error to the server
    console.log(error);
    res.status(500).json({ message: "Error -- Could not find user." });
  }
});

router.put("/:id", validateUserId, validateUser, async (req, res) => {
  try {
    const user = await Users.update(req.params.id, req.body);
    if (user) {
      res.status(200).json({ id: req.params.id, ...req.body });
    } else {
      res.status(404).json({ message: "Error -- Could not find user." });
    }
  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({ message: "Error -- Could not Update the user." });
  }
});

//custom middleware

async function validateUserId(req, res, next) {
  try {
    const { id } = req.params;
    const user = await Users.getById(id);
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).json({ message: "Error -- User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error == Erasing Hard Drive" });
  }
}

function validateUser(req, res, next) {
  if (req.body && Object.keys(req.body).length) {
    if (req.body.name !== "") {
      next();
    } else {
      res.status(400).json({ message: "Please include a name for the user" });
    }
  } else {
    res.status(500).json({ message: "Error -- Missing vital data" });
  }
}

function validatePost(req, res, next) {
  if (req.body && Object.keys(req.body).length) {
    if (req.body.text !== "") {
      next();
    } else {
      res
        .status(400)
        .json({ message: "Please include a body in the the post" });
    }
  } else {
    res.status(500).json({ message: "Error -- Missing vital data" });
  }
}

module.exports = router;
