const bcrypt = require("bcryptjs");
exports.seed = function (knex) {
  // 000-cleanup.js already cleaned out all tables

  const users = [
    {
      username: "newAccount",
      password: "123123",
    },
    {
      username: "admin",
      password: bcrypt.hashSync("secretToMyGrave", 10),
    },
    {
      username: "David",
      password: bcrypt.hashSync("secretToMyGrave", 10),
    },
    {
      username: "Luis",
      password: bcrypt.hashSync("secretToMyGrave", 10),
    },
    {
      username: "lambda",
      password: bcrypt.hashSync("secretToMyGrave", 10),
    },
  ];

  return knex("users").insert(users);
};
