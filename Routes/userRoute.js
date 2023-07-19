const router = require("express").Router();
const { check } = require("express-validator");
const {
  loginUser,
  createUser,
  updateUserData,
  requestForBook,
  getUserData,
} = require("../Controllers/userController");
const verifyJWT = require("../Middlewares/verifyJWT");

//REGISTER NEW USER
router.post(
  "/auth/register",
  check("email", "Please Enter A Valid email").isEmail(),
  check("password", "A Valid Password Is Required").exists(),
  createUser
);

//LOGIN USER TO THEIR ACCOUNT
router.post("/auth/login", loginUser);


//GET USER DATA
router.get("/:email", verifyJWT, getUserData);

// UPDATE USER DETAILS
router.put("/:id", verifyJWT, updateUserData);

//REQUEST FOR BOOK
router.post("/request-book", verifyJWT, requestForBook);

module.exports = router;
