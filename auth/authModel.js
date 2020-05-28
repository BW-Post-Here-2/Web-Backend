const db = require("../database/dbConfig.js");
const jwt = require("jsonwebtoken");
const secrets = require("./secrets");

module.exports = {
  find,
  generateToken,
  findBy,
  add,
  findById,
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

function findBy(filter) {
  console.log("filter", filter);
  return (
    db("users as u")
      // .join("roles as r", "u.role", "=", "r.id")
      .where(filter)
  );
  // .select("u.id", "u.username", "r.name as role", "u.password")
  // .orderBy("u.id");
}

async function add(users) {
  try {
    const [id] = await db("users").insert(users, "id");

    return findById(id);
  } catch (error) {
    throw error;
  }
}

function findById(id) {
  return db("users").where({ id }).first();
}
