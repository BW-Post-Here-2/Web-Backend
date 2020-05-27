const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secrets = require("../auth/secrets");
const authenticator = require("../auth/authenticator");

const db = require("../database/dbConfig");

router.get("/posts", (req, res) => {
  find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Error fetching the posts" });
    });
});

router.post("/favorite", (req, res) => {
  if (!req.body.post_id) {
    return res.status(403).json({ message: "Missing post id" });
  }
  findByPostID(req.body.post_id).then((data) => {
    if (data) {
      findIDbyusername(req.headers.authorization).then((user_id) => {
        db("predictions")
          .select("*")
          .first()
          .then((song) => {
            if (song) {
              res.status(403).json({ message: "You already liked that song" });
            } else {
              db("predictions")
                .insert({ user_id, post_id: req.body.post_id }, "*")
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
  findIDbyusername(req.headers.authorization).then((id) => {
    db("predictions as pr")
      .where({ user_id: id })
      .join("posts as po", function () {
        this.on("pr.post_id", "=", "po.id");
      })
      .select("*")
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

function find() {
  return db("posts").select("*");
}

function findByPostID(id) {
  return db("posts").select("*").where({ id }).first();
}

function findIDbyusername(token) {
  const { username } = jwt.verify(token, secrets.secret);
  return db("Users")
    .select("id")
    .where({ username: username })
    .first()
    .then(({ id }) => {
      return id;
    });
}

module.exports = router;
