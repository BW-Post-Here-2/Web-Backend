const supertest = require("supertest");
const server = require("./server");
// const model = require("../auth/auth");
const bcrypt = require("bcryptjs");
const db = require("../database/dbConfig");
const auth = require("../auth/authModel");
const Reddit = require("../reddit/redditModel");
// let volunteerToken;
const jwt = require("jsonwebtoken");
const secrets = require("../auth/secrets");

let volunteerToken;

beforeEach(async () => {
  await db.migrate
    .rollback()
    .then(() => db.migrate.latest())
    .then(() => db.seed.run());

  return supertest(server).post("/api/auth/register").send({
    username: "David",
    password: "123123123",
  });
  volunteerToken = res.body.token;
});

describe("server", () => {
  it("can run", () => {
    expect(true).toBeTruthy();
  });
  describe("GET /", () => {
    it("should return http status 200", () => {
      return supertest(server)
        .get("/")
        .then((response) => {
          expect(response.status).toBe(200);
          expect(response.status).toBeTruthy();
        });
    });
  });
  it("should return {objects}", () => {
    return supertest(server)
      .get("/")
      .then((res) => {
        expect(res.body).toEqual({
          message: "api up",
          "auth_endpoints_under_api/auth": {
            login: "POST /api/auth/login",
            register: "POST /api/auth/register",
          },
          "reddit_endpoints_under_api/reddit": {
            posts: "GET /api/reddit/posts",
            favorite1: "POST /api/reddit/favorite",
            favorite2: "GET /api/reddit/favorite",
            message: "under development",
          },
        });
        expect(res.body.message).toBeDefined();
        expect(res.body["auth_endpoints_under_api/auth"]).toBeDefined();
        expect(res.body["reddit_endpoints_under_api/reddit"]).toBeDefined();
      });
  });
});

describe("get users, validate user", () => {
  it("get all users", async () => {
    const register = await supertest(server)
      .post("/api/auth/register")
      .send({ username: "david", password: "123123123" });
    const login = await supertest(server)
      .post("/api/auth/login")
      .send({ username: "david", password: "123123123" });
    const res = await supertest(server)
      .get("/api/auth/")
      .set("authorization", login.body.token);
    expect(res.body.users).toHaveLength(6);
    // console.log(res.body);
    expect(res.body.users[0]).toHaveProperty("id");
    expect(res.body.users[0]).toMatchObject({ id: 1 });
  });
});

describe("test register", () => {
  it("post /api/auth/register to be successful", async () => {
    const res = await supertest(server)
      .post("/api/auth/register")
      .send({ username: "david", password: "123123123" });
    expect(res.status).toBe(201);
    // console.log(res.body);
    expect(res.body).toMatchObject({
      username: "david",
    });
  });
});
describe("test post", () => {
  it("post /api/auth/register to fail", async () => {
    const res = await supertest(server)
      .post("/api/auth/register")
      .send({ username: "newAccount", password: "123123" });
    expect(res.status).toBe(402);
    // console.log(res.body);
    expect(res.body).toMatchObject({
      message: "User is already registered",
    });
  });
});

describe("test login post", () => {
  test("post /api/auth/login to be successful", async () => {
    const register = await supertest(server)
      .post("/api/auth/register")
      .send({ username: "david", password: "123123123" });
    const res = await supertest(server)
      .post("/api/auth/login")
      .send({ username: "david", password: "123123123" });
    expect(res.type).toBe("application/json");
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    // console.log(res);
    token = res.body.token;
  });
});

describe("POST /api/users/register", () => {
  test("6th account created", async () => {
    const res = await supertest(server)
      .post("/api/auth/register")
      .send({ username: "Brandon", password: "123123" });
    expect(res.body).toMatchObject({ id: 6 });
    // console.log("res.body", res.body);
    expect(res.body).toMatchObject({
      username: "Brandon",
    });
  });

  it("return 201 created", function (done) {
    return supertest(server)
      .post("/api/auth/register")
      .send({ username: "John", password: "123123" })
      .expect(201)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });

  describe("get users", () => {
    it("get all users as long as you are logged in", async () => {
      const res = await supertest(server)
        .get("/api/auth/user")
        .set("Authorization", token)
        .expect(200);
    });
  });

  it("should correct length of user list", async () => {
    await auth.add({ username: "Sherlock", password: "123abc" });

    // read data from the table
    const users = await db("users");
    let amount = users.length;
    expect(users).toHaveLength(amount);
    // console.log(`expect(users).toHaveLength(amount)`, amount);
  });
});

describe("DELETE /favorite", () => {
  it("should return correct length after remove users", async () => {
    const users = db("users");
    let amount = users.length;
    await auth.remove(amount - 1);

    const data = await db("users");
    newAmount = data.length;
    expect(data).toHaveLength(newAmount);
  });
  it("should return undefine on the deleted id", async () => {
    const users = db("users");
    let amount = users.length;
    await auth.remove(amount - 1);
    // read data from the table
    const newUsers = await db("users");
    expect(newUsers[newUsers.length]).toBeUndefined();
  });
});

describe("PUT API/AUTH/USER updating user", () => {
  test("register & login to get token then favorite", async () => {
    const register = await supertest(server)
      .post("/api/auth/register")
      .send({ username: "david", password: "123123123" });
    const res = await supertest(server)
      .post("/api/auth/login")
      .send({ username: "david", password: "123123123" });

    const updatedUser = await supertest(server)
      .put("/api/auth/user")
      .set("authorization", res.body.token)
      .send({ username: "david", password: "321321321" });
    expect(updatedUser.status).toBe(201);
  });
});

// describe("POST api/reddit/post able to make a new post", () => {
//   test("first let's make the foundation", async () => {
//     const register = await supertest(server)
//       .post("/api/auth/register")
//       .send({ username: "david", password: "123123123" });
//     const res = await supertest(server)
//       .post("/api/auth/login")
//       .send({ username: "david", password: "123123123" });

//     const updatedUser = await supertest(server)
//       .put("/api/auth/user")
//       .set("authorization", res.body.token)
//       .send({ username: "david", password: "321321321" });
//     const post = await supertest(server)
//       .post("/api/reddit/posts")
//       .set("authorization", res.body.token)
//       .send({
//         subreddits: "CONVERSATION",
//         post_title: "How to win over friends and influence people",
//         post_content: "This book still can apply to our life!",
//       });
//     // const favorite = await supertest(server)
//     //   .post("/api/reddit/favorite")
//     //   .set("authorization", res.body.token)
//     //   .send({ post_id: "1" });
//     // console.log(post);
//     expect(post.status).toBe(201);
//   });
// });

describe("POST api/reddit/favorite able to favorite a post", () => {
  test("first let's make the foundation", async () => {
    const register = await supertest(server)
      .post("/api/auth/register")
      .send({ username: "david", password: "123123123" });
    const res = await supertest(server)
      .post("/api/auth/login")
      .send({ username: "david", password: "123123123" });

    const favorite = await supertest(server)
      .post("/api/reddit/favorite")
      .set("authorization", res.body.token)
      .send({ post_id: "1" });
    // console.log(favorite);
    expect(favorite.status).toBe(201);
  });
});

describe("DELETE api/reddit/favorite able to delete a favorited post", () => {
  test("first let's make the foundation", async () => {
    const register = await supertest(server)
      .post("/api/auth/register")
      .send({ username: "david", password: "123123123" });
    const res = await supertest(server)
      .post("/api/auth/login")
      .send({ username: "david", password: "123123123" });

    const favorite = await supertest(server)
      .post("/api/reddit/favorite")
      .set("authorization", res.body.token)
      .send({ post_id: "1" });

    const deletePost = await supertest(server)
      .delete("/api/reddit/favorite")
      .set("authorization", res.body.token)
      .send({ post_id: "1" });
    // console.log(deletePost);
    expect(deletePost.status).toBe(200);
  });
});
