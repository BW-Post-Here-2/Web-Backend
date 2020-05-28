const db = require("../database/dbConfig");
const jwt = require("jsonwebtoken");
const secrets = require("../auth/secrets");

module.exports = {
  find,
  findByPostID,
  findIDbyusername,
};

function find() {
  return db("posts").select("*");
}

function findByPostID(id) {
  return db("posts").select("*").where({ id }).first();
}

function findIDbyusername(token) {
  const { username } = jwt.verify(token, secrets.secret);
  // console.log(username);
  return db("users")
    .select("id")
    .where({ username: username })
    .first()
    .then(({ id }) => {
      console.log("findIDbyusername", id);
      return id;
    });
}
