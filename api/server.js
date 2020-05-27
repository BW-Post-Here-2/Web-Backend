const express = require("express");
const cors = require("cors");

const authRouter = require("../auth/authRouter");
const redditRouter = require("../reddit/redditRouter");

const authenticator = require("../auth/authenticator");

const server = express();
server.use(express.json());
server.use(cors());

server.use("/api/auth", authRouter);

server.use("/api/reddit", authenticator, redditRouter);

server.get("/", (req, res) => {
  res.json({
    message: "api up",
    "auth_endpoints_under_api/auth": {
      login: "POST /api/auth/login",
      register: "POST /api/auth/register",
    },
    "reddit_endpoints_under_api/reddit": {
      posts: "GET /api/reddit/posts",
      favorite: "POST /api/reddit/favorite",
      favorite: "GET /api/reddit/favorite",
      message: "under development",
    },
  });
});

module.exports = server;
