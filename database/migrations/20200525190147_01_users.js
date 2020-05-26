exports.up = function (knex) {
  return knex.schema.createTable("Users", (Users) => {
    Users.increments("id");
    Users.string("username", 256).notNullable().unique().index();
    Users.string("password", 256).notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Users");
};
