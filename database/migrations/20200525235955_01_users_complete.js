exports.up = function (knex) {
  return knex.schema
    .createTable("users", (tbl) => {
      tbl.increments("id");
      tbl.string("username", 256).notNullable().unique().index();
      tbl.string("password", 256).notNullable();
    })
    .createTable("posts", (table) => {
      table.increments("id");

      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("post_title", 128).notNullable();
      table.text("post_content").notNullable();
    })
    .createTable("predictions", (tbl) => {
      tbl.increments("id");
      tbl
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      tbl
        .integer("post_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("posts")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      tbl.json("prediction");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("predictions")
    .dropTableIfExists("posts")
    .dropTableIfExists("users");
};
