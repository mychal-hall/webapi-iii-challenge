const express = require("express");

const server = express();

// defining the routers
const postRouter = require("./posts/postRouter.js");
const userRouter = require("./users/userRouter.js");

server.use(express.json());
server.use(logger);

// Setting up the router default endpoints
server.use("/api/posts/", postRouter);
server.use("/api/users/", userRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  const time = new Date();
  console.log(`${req.method} Request`, time, `${req.url}`);
  next();
}

module.exports = server;
