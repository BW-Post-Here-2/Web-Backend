const db = require("../database/dbConfig.js");
const jwt = require("jsonwebtoken");
const secrets = require("./secrets");

module.exports = {
  find,
  generateToken,
};

function find() {
  return db("users").select("id", "username").orderBy("id");
}

function generateToken(user) {
  const payload = {
    username: user.username,
  };
  const options = {
    expiresIn: "7d",
  };
  return jwt.sign(payload, secrets.secret, options);
}
