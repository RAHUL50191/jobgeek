const jwt = require("jsonwebtoken");
const config = require("../config/config");
const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];
  if (!token) {
    res.status(401).send("not authorized:token required");
  }
  try {
    const decode = jwt.verify(token, config.secret_jwt);
  } catch (err) {
    // console.log(err.message);
    res.status(401).end("not authorized:invalid token");
  }
  return next();
};
module.exports = verifyToken;
