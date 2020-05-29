const db = require("../database/dbConfig");
const jwt = require("jsonwebtoken");
const secrets = require("../auth/secrets");

module.exports = {
  find,
  findByPostID,
  findIDbyusername,
  getBy,
  getByUserId,
  getByPostId,
  add,
  remove,
  update,
  addPost,
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
      console.log("findIDbyusername", { id });
      return id;
    });
}

function addPost(post) {
  return db("posts").insert(post);
}

function getBy(filter) {
  return db("posts").where(filter);
}

function getByUserId(id) {
  return db("posts").where({ id: id });
}

function getByPostId(id) {
  console.log(id);
  return db("posts").where({ id });

  //return db("posts").where({ id }).first();
}

async function add(post) {
  const [id] = await db("posts").insert(post, "id");
  return findByPostId(id);
}

function remove(id) {
  return db("predictions")
    .where({ user_id: id, post_id: req.body.post_id }, "*")
    .delete();
}

async function update(id, body) {
  let { post_title, post_text } = body;
  await db("posts").where({ id }).update({ post_title, post_text });
  return findByPostId(id);
}
