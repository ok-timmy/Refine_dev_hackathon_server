const router = require("express").Router();
const { check } = require("express-validator");
const {
  loginToLibrary,
  createLibrary,
  updateLibrary,
  uploadBook,
  approveOrDeclineBookRequest,
  markBookAsReturned,
  getLibraryData,
  getRequestedBooks,
} = require("../Controllers/libraryController");
const verifyJWT = require("../Middlewares/verifyJWT");
const verifyLibrarian = require("../Middlewares/verifyLibrarian");

//REGISTER NEW LIBRARY
router.post(
  "/auth/register",
  check("email", "Please Enter A Valid email").isEmail(),
  check("password", "A Valid Password Is Required").exists(),
  createLibrary
);

//LOGIN LIBRARIANS TO THEIR ACCOUNT
router.post("/auth/login", loginToLibrary);


//GET LIBRARY DATA
router.get("/:email", verifyJWT, getLibraryData);

//GET REQUESTED BOOKS
router.get("/requested-books", verifyJWT, getRequestedBooks);

// UPDATE LIBRARY
router.put("/:libraryId", verifyJWT, verifyLibrarian, updateLibrary);

// UPLOAD BOOK
router.post("/uploadBook", verifyJWT, verifyLibrarian, uploadBook);

//APPROVE OR DECLINE BOOK
router.post("/approveOrDecline", verifyJWT, verifyLibrarian, approveOrDeclineBookRequest);

//MARK BOOK AS RETURNED
router.post("/markAsReturned", verifyJWT, verifyLibrarian, markBookAsReturned);

module.exports = router;
