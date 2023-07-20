const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["Authorization"] || req.headers["authorization"];
  if (!authHeader) {
    console.log("No Auth Header")
    return res.sendStatus(401);
  }
  // console.log(authHeader);

  const token = authHeader;
  // console.log(token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded)=> {
    if (err){
      console.log(err);
        return res.sendStatus(403);  //Invalid token was send back to the backend
    }
    req.email = decoded.libraryEmail || decoded.userEmail;
    next();
  })
};


module.exports = verifyJWT;