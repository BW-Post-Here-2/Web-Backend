exports.up = function (knex) {
  return knex.schema
    .createTable("Users", (tbl) => {
      tbl.increments().index();
      tbl.string("username", 256).notNullable().unique().index();
      tbl.string("password", 256).notNullable();
    })
    .createTable("Subreddit", (table) => {
      table.increments();

      table.string("sub_title_name", 128).notNullable().unique().index();
      table.string("sub_title_descriptions", 256).notNullable();
    })
    .createTable("User_profile", (tab) => {
      tab.increments();
      tab.string("user_post_title", 128).notNullable().unique().index();
      tab.string("user_post_descriptions", 256).notNullable();
    })
    .createTable("Posts", (tbl) => {
      tbl.increments();
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
        .integer("posts_users_id")
        .notNullable()
        .references("id")
        .inTable("User_profile")
        .onDelete("RESTRICT")
        .onUpdate("CASCADE");
    })
    .createTable("User_post_posted", (tbl) => {
      tbl.increments("id");
      tbl
        .integer("user_id")
        .notNullable()
        .references("id")
        .inTable("Users")
        .onDelete("RESTRICT")
        .onUpdate("CASCADE");

      tbl
        .integer("post_id")
        .notNullable()
        .references("id")
        .inTable("Posts")
        .onDelete("RESTRICT")
        .onUpdate("CASCADE");
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
