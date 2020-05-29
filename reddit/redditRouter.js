const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secrets = require("../auth/secrets");
const authenticator = require("../auth/authenticator");
const Reddit = require("./redditModel");

const db = require("../database/dbConfig");

router.get("/posts", (req, res) => {
  Reddit.find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Error fetching the posts" });
    });
});

router.post("/posts", (req, res) => {
  const anotherPost = req.body;
  Reddit.addPost(anotherPost)
    .then((post) => {
      if (post) {
        res.status(201).json(post);
      } else {
        res.status(404).json({ message: "Couldn't make the post." });
      }
      s;
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to create new post" });
    });
});

// select u.id ,po.subreddits, po.post_title,po.post_content
// from posts as po
// join predictions as pr on po.id = pr.post_id
// join users as u on u.id = pr.user_id
// where u.id = 8

router.post("/favorite", (req, res) => {
  if (!req.body.post_id) {
    return res.status(403).json({ message: "Missing post id" });
  }
  Reddit.findByPostID(req.body.post_id).then((data) => {
    // select pr.post_id, pr.user_id
    // from predictions as pr
    // join posts as po on po.id = pr.post_id

    if (data) {
      Reddit.findIDbyusername(req.headers.authorization).then((user_id) => {
        db("predictions as pr")
          .join("posts as po", "pr.post_id", "=", "po.id")
          .select("pr.post_id", "pr.user_id")
          .where({ user_id: user_id, post_id: req.body.post_id })
          .first()
          .then((post) => {
            if (post) {
              res.status(403).json({ message: "You already liked that post" });
            } else {
              db("predictions")
                .insert({ user_id: user_id, post_id: req.body.post_id }, "*")
                .then(([data]) => {
                  data
                    ? res
                        .status(201)
                        .json({ message: "Added to favorited post!" })
                    : res.status(500).json({ message: "Couldn't add :(" });
                });
            }
          });
      });
    } else {
      res
        .status(404)
        .json({ message: "Couldn't find post with that post id " });
    }
  });
});

router.get("/favorite", (req, res) => {
  Reddit.findIDbyusername(req.headers.authorization).then((id) => {
    // console.log(id);
    db("predictions as pr")
      .select(
        "pr.id",
        "pr.user_id",
        "pr.post_id",
        "po.subreddits",
        "po.post_title",
        "po.post_content"
      )
      .join("posts as po", "po.id", "=", "pr.post_id")
      .where("pr.user_id", id)
      .orderBy("pr.id")
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        console.log(err);
        res.status({ message: "Error retrieving favorite posts" });
      });
  });
});

router.delete("/favorite", (req, res) => {
  if (!req.body.post_id) {
    return res.status(403).json({ message: "Please provide the post ID" });
  }
  Reddit.findIDbyusername(req.headers.authorization).then((id) => {
    db("predictions")
      .where({ user_id: id, post_id: req.body.post_id }, "*")
      .delete()
      .then((data) => {
        // console.log(data);
        data
          ? res.status(200).json({
              message: "Your favorite post is removed from favorite post list",
              post_id: req.body.post_id,
            })
          : res
              .status(201)
              .json({ message: "Couldn't find favorite post with that id" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Error deleting post" });
      });
  });
});

module.exports = router;
