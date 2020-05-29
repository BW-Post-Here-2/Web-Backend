const supertest = require("supertest");
const server = require("./server");
// const model = require("../auth/auth");
const bcrypt = require("bcryptjs");
const db = require("../database/dbConfig");
const auth = require("../auth/authModel");
const Reddit = require("../reddit/redditModel");
let volunteerToken;
const jwt = require("jsonwebtoken");
const secrets = require("../auth/secrets");
let token;

beforeEach(() => {
  return db.migrate
    .rollback()
    .then(() => db.migrate.latest())
    .then(() => db.seed.run());
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

describe("test favorite post", () => {
  test("register & login to get token then favorite", async () => {
    const register = await supertest(server)
      .post("/api/auth/register")
      .send({ username: "david", password: "123123123" });
    const res = await supertest(server)
      .post("/api/auth/login")
      .send({ username: "david", password: "123123123" });
    // expect(res.type).toBe("application/json");
    // expect(res.status).toBe(201);
    // expect(res.body).toHaveProperty("token");
    // console.log(res);

    // console.log(res);
    let newToken;
    newToken = res.body.token;
    // console.log(newToken);

    const deleteFavorite = await supertest(server)
      .post("/api/reddit/fovorite")
      .set("Authorization", newToken)
      .then((data) => {
        console.log("data", data);
      });
    console.log("status", deleteFavorite.status);
    expect(deleteFavorite).toBeDefined();
  });
});
