const jwt = require("jsonwebtoken");
const secrets = require("./secrets");
module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  jwt.verify(token, secrets.secret, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ err: "Not authorized" });
    }
    next();
  });
};
