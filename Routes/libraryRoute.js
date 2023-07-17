const router = require("express").Router();
const { check } = require("express-validator");
const {
  loginToLibrary,
  createLibrary,
  updateLibrary,
  uploadBook,
  approveOrDeclineBookRequest,
  markBookAsReturned,
} = require("../Controllers/libraryController");

//REGISTER NEW LIBRARY
router.post(
  "/auth/register",
  check("email", "Please Enter A Valid email").isEmail(),
  check("password", "A Valid Password Is Required").exists(),
  createLibrary
);

//LOGIN LIBRARIANS TO THEIR ACCOUNT
router.post("/auth/login", loginToLibrary);

// UPDATE LIBRARY
router.put("/:libraryId", updateLibrary);

// UPLOAD BOOK
router.post("/uploadBook", uploadBook);

//APPROVE OR DECLINE BOOK
router.post("/approveOrDecline", approveOrDeclineBookRequest);

//MARK BOOK AS RETURNED
router.post("/markAsReturned", markBookAsReturned);

module.exports = router;
