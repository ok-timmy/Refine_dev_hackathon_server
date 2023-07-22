const router = require("express").Router();
const {
  handleUserRefreshToken,
  handleLibrarianRefreshToken,
} = require("../Controllers/refreshTokenController");

//GET USER REFRESH TOKEN
router.post("/user/refreshToken", handleUserRefreshToken);

// GET LIBRARY REFRESH TOKEN
router.post("/library/refreshToken", handleLibrarianRefreshToken);

module.exports = router;
