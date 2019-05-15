const express = require("express");

const server = express();

const postRouter = require("./posts/postRouter.js");
const userRouter = require("./users/userRouter.js");

server.use(express.json());

server.use("/api/posts/", postRouter);
server.use("/api/users/", userRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {}

module.exports = server;
