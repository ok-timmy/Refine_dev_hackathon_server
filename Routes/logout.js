const router = require("express").Router();
const {
  handleLogoutForUserController,
  handleLogoutForLibrarianController,
} = require("../Controllers/logoutController");

//LOG OUT USER
router.get("/user", handleLogoutForUserController);

//LOG OUT LIBRARIAN
router.get("/library", handleLogoutForLibrarianController);

module.exports = router;
