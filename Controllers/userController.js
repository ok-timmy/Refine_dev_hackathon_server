const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
// const cookie = require("cookie-parser");
const { validationResult } = require("express-validator");
const saltRounds = 10;
const User = require("../Models/User");
const Book = require("../Models/Book");

//SIGN UP USER
exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Check If User already exist and return appropriate error.
  const checkUserExist = await User.findOne({ email: req.body.email });
  if (checkUserExist) {
    return res
      .status(409)
      .json({ statusCode: 409, message: "This Email Already exists" });
  }

  try {
    const { firstName, lastName, email, password } = req.body;
    hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.json({
      status: 200,
      message: "User Created Successfully",
    });
  } catch (error) {
    res.status(500).json(error.code);
    console.log(error);
  }
};

// SIGN IN USER
exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const foundUser = await User.findOne({ email: req.body.email });

    if (foundUser) {
      const validate = await bcrypt.compare(
        req.body.password,
        foundUser.password
      );

      if (validate) {
        const accessToken = jwt.sign(
          { userEmail: foundUser.email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "12000s" }
        );

        const refreshToken = jwt.sign(
          { userEmail: foundUser.email },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );

        foundUser.refreshToken = refreshToken;
        await foundUser.save();

        res.cookie("jwt", accessToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24,
          sameSite: "None",
          secure: true,
        });

        const foundUserExceptPassword = await User.findOne({
          email: req.body.email,
        })
          .select("-password")
          .select("-refreshToken");

        res.status(200).json({
          data: foundUserExceptPassword,
          accessToken,
        });
      } else {
        res.status(401).json({ error: "Incorrect Password" });
      }
    } else {
      res.status(401).send({ message: "User does not exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(403).send({ message: error });
  }
};

//GET USER DATA
exports.getUserData = async (req, res) => {
  try {
    const foundUser = await User.findOne({ email: req.params.email })
      .select("-password")
      .select("-refreshToken").populate("booksRequested").populate("booksBorrowed");
    res.status(200).json(foundUser);
  } catch {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An Error Occured, Please try Again" });
  }
};

//UPDATE USER DATA
exports.updateUserData = async (req, res) => {
  try {
    var id = { _id: req.params.id };

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    })
      .select("-password")
      .select("-refreshToken");

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(403).send(error);
  }
};

//REQUEST FOR BOOK
exports.requestForBook = async (req, res) => {
  const { id, userId, promised_return_date } = req.body;

  if (!id || !userId || !promised_return_date) {
    return res
      .status(403)
      .json({ message: "One of the required parameters is missing" });
  }

  const bookToBeBorrowed = await Book.findOne({ _id: id });

  try {
    if (bookToBeBorrowed.status === "available") {
      const bookRequested = await bookToBeBorrowed.updateOne(
        {
          $set: {
            date_requested: new Date(),
            date_promised_by_borrower: promised_return_date,
            status: "requested",
            requester: userId,
          },
        },
        {
          new: true,
        }
      );
      await User.findByIdAndUpdate(userId, {
        $push: {
          booksRequested: id,
        },
      }, {
        new: true
      });
      return res.status(200).json({
        message: "Book request has been sent",
        data: bookRequested,
      });
    } else {
      return res.status(403).json({
        message: " Book is unavailable or has been requested by another user",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An Error occured while processing request", error });
  }
};
