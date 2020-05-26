const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secrets = require("./secrets");
const authenticator = require("./authenticator");

const db = require("../database/dbConfig");

router.post("/register", userValidation, (req, res) => {
  const credentials = req.body;
  //Find user in databe
  db("Users")
    .select("username")
    .where({ username: credentials.username })
    .then((data) => {
      if (data.length == 0) {
        //checks if user is already registered
        credentials.password = bcrypt.hashSync(credentials.password, 8); //hash password
        db("Users")
          .insert(credentials, ["id"])
          .then(([id]) => {
            db("Users")
              .select("*")
              .where({ id })
              .then(([user]) => {
                //get new user in db
                res.status(201).json(user);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        res.status(201).json({ message: "User is already registered" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Error creating new user" });
    });
});

router.post("/login", userValidation, (req, res) => {
  const { username, password } = req.body;
  db("Users")
    .select("*")
    .where({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(201).json({ msg: "Authorized", token });
      } else {
        res.status(401).json({ message: "Not authorized" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err });
    });
});

router.get("/user", authenticator, (req, res) => {
  const { username } = jwt.verify(req.headers.authorization, secrets.secret);
  db("Users")
    .select("username")
    .where({ username: username })
    .first()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Error retrieving user" });
    });
});

router.put("/user", userValidation, authenticator, (req, res) => {
  const credentials = req.body;
  const { username } = jwt.verify(req.headers.authorization, secrets.secret);
  db("Users")
    .select("id")
    .where({ username: username })
    .first()
    .then((id) => {
      credentials.password = bcrypt.hashSync(credentials.password, 8); //hash password
      db("Users")
        .update(credentials)
        .where(id)
        .then((data) => {
          data
            ? res.status(201).json({ message: "User updated succesfully" })
            : res.status(500).json({ message: "User couldnt be updated" });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ message: "Error updating user" });
        });
    });
});

module.exports = router;

function userValidation(req, res, next) {
  if (!req.body.username || !req.body.password) {
    res.status(403).send({
      message: "Please make sure to provide both username and password",
    });
  }
  next();
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

/* Another login option
  if(user){
            if(bcrypt.compareSync(password,user.password)){
                const token = generateToken(user);
                res.status(201).json({msg:"Authorized",token})
            }else{
                res.status(403).json({message:"Wrong password"});
            }

        }else{
            res.status(403).json({message:"Wrong username"});
        }
*/
