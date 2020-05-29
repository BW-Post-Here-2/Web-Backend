const bcrypt = require("bcryptjs");
exports.seed = function (knex) {
  // 000-cleanup.js already cleaned out all tables

  const posts = [
    {
      subreddits: "CONVERSATION",
      post_title: "How to win over friends and influence people",
      post_content: "This book still can apply to our life!",
    },
    {
      subreddits: "Pandemic",
      post_title: "How to overcome bordom during Qurantine",
      post_content: "This book still can apply to our life!",
    },
    {
      subreddits: "Safe",
      post_title: "When you meet a wild animal",
      post_content: "This book still can apply to our life!",
    },
    {
      subreddits: "Keto",
      post_title: "What's keto?",
      post_content: "This book still can apply to our life!",
    },
    {
      subreddits: "Food",
      post_title: "Eating balanced 101",
      post_content: "This book still can apply to our life!",
    },
  ];

  return knex("posts").insert(posts);
};
