exports.up = function (knex, Promise) {
  return knex.schema
    .createTable("Users", (tbl) => {
      tbl.increments("id");
      tbl.string("username", 256).notNullable().unique().index();
      tbl.string("password", 256).notNullable();
    })
    .createTable("Subreddit", (tbl) => {
      tbl.increments("id");
      tbl.string("sub_title.name");
      tbl.string("sub_title_descriptions");
    })
    .createTabe("User_profile", (tbl) => {
      tbl.increments("id");
      tbl.string("user_post_title");
    })
    .createTabe("Posts", (tbl) => {
      tbl.increments("id");
      tbl.string("post_title");
      tbl.string("post_length");

      tbl
        .integer("subreddit_id")
        .notNullable()
        .references("id")
        .inTable("Subreddit")
        .onDelete("RESTRICT")
        .onUpdate("CASCADE");

      tbl
        .integer("Posts_users_id")
        .notNullable()
        .references("id")
        .inTable("User_profile")
        .onDelete("RESTRICT")
        .onUpdate("CASCADE");
    })
    .createTabe("User_post_posted", (tbl) => {
      tbl.increments("id");
      tbl.string("user_post_title");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("User_post_posted")
    .dropTableIfExists("Posts")
    .dropTableIfExists("User_profile")
    .dropTableIfExists("Subreddit")
    .dropTableIfExists("Users");
};
