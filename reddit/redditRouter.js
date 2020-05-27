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
    // select pr.post_id, pr.user_id
    // from predictions as pr
    // join posts as po on po.id = pr.post_id

    if (data) {
      findIDbyusername(req.headers.authorization).then((user_id) => {
        db("predictions as pr")
          .join("posts as po", "pr.post_id", "=", "po.id")
          .select("pr.post_id", "pr.user_id")
          .where({ user_id: req.body.user_id, post_id: req.body.post_id })
          .first()
          .then((post) => {
            if (post) {
              res.status(403).json({ message: "You already liked that post" });
            } else {
              db("predictions")
                .insert(
                  { user_id: req.body.user_id, post_id: req.body.post_id },
                  "*"
                )
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
    // console.log(id);
    db("predictions as pr")
      .select("*")
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

function find() {
  return db("posts").select("*");
}

function findByPostID(id) {
  return db("posts").select("*").where({ id }).first();
}

function findIDbyusername(token) {
  const { username } = jwt.verify(token, secrets.secret);
  console.log(username);
  return db("users")
    .select("id")
    .where({ username: username })
    .first()
    .then(({ id }) => {
      console.log("findIDbyusername", id);
      return id;
    });
}

module.exports = router;
