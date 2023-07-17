const router = require("express").Router();
const {
  handleUserRefreshToken,
  handleLibrarianRefreshToken,
} = require("../Controllers/refreshTokenController");

//GET USER REFRESH TOKEN
router.get("/user/refreshToken", handleUserRefreshToken);

// GET LIBRARY REFRESH TOKEN
router.get("/library/refreshToken", handleLibrarianRefreshToken);

module.exports = router;
