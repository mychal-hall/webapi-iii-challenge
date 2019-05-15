const express = require("express");

const Users = require("./userDb.js");

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

router.post("/:id/posts", (req, res) => {});

router.get("/:id/posts", (req, res) => {});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

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
