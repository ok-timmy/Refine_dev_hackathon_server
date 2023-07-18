const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { validationResult } = require("express-validator");
const saltRounds = 10;
const Library = require("../Models/Library");
const Book = require("../Models/Book");

// CREATE LIBRARY
exports.createLibrary = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Check If User already exist and return appropriate error.
  const checkLibraryExist = await Library.findOne({ email: req.body.email });
  if (checkLibraryExist) {
    return res.status(409).json({
      statusCode: 409,
      message: "Another Library has taken this email already",
    });
  }

  try {
    const { libraryName, email, about, address, password } = req.body;
    hashedPassword = await bcrypt.hash(password, saltRounds);
    const newLibrary = await new Library({
      libraryName,
      email,
      about,
      address,
      password: hashedPassword,
    });

    await newLibrary.save();
    res.json({
      status: 200,
      message: "New Library Created Successfully",
    });
  } catch (error) {
    res.status(500).json(error.code);
    console.log(error);
  }
};

//LOGIN TO LIBRARY
exports.loginToLibrary = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const foundLibrary = await Library.findOne({ email: req.body.email });

    if (foundLibrary) {
      const validate = await bcrypt.compare(
        req.body.password,
        foundLibrary.password
      );

      if (validate) {
        const accessToken = jwt.sign(
          { libraryEmail: foundLibrary.email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "12000s" }
        );

        const refreshToken = jwt.sign(
          { libraryEmail: foundLibrary.email },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );

        foundLibrary.refreshToken = refreshToken;
        await foundLibrary.save();

        res.cookie("jwt", accessToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24,
          sameSite: "None",
          secure: true,
        });

        const {
          _id,
          email,
          libraryName,
          address,
          about,
          image,
          booksRequested,
          availableBooks,
        } = foundLibrary;

        res.status(200).json({
          _id,
          email,
          libraryName,
          address,
          about,
          image,
          accessToken,
          booksRequested,
          availableBooks,
        });
      } else {
        res.status(401).json({ error: "Incorrect Password" });
      }
    } else {
      res.status(401).send({ message: "Library does not exist" });
    }
  } catch (error) {
    res.status(403).send({ message: error });
  }
};

// GET LIBRARY DATA FOR LIBRARY DASHBOARD
exports.getLibraryData = async (req, res) => {
  try {
    const foundLibrary = await Library.findOne({ email: req.params.email })
      .select("-password")
      .select("-refreshToken")
      .populate(
        "availableBooks",
        "bookTitle  bookDescription bookId date_requested date_promised_by_borrower date_borrowed date_to_be_returned status bookImage"
      );

    res.status(200).json(foundLibrary);
  } catch {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An Error Occured, Please try Again" });
  }
};

//GET BOOKS THAT HAVE BEEN REQUESTED BY A USER
exports.getRequestedBooks = async (req, res) => {
  const { libraryId } = req.body;
  try {
    const allBooks = await Book.find();
    const requestedBooks = allBooks.map((book) => {
      return book.library_that_owns_book === libraryId && book.requester != "";
    });
    const populatedRequestedBooks = requestedBooks.populate(
      "requester",
      "firstName lastName email bio address phoneNumber image"
    );
    return res
      .status(200)
      .json({
        message: "Books fetched successfully",
        data: populatedRequestedBooks,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An error occured while fetching books", error });
  }
};

//UPDATE LIBRARY DETAILS
exports.updateLibrary = async (req, res) => {
  try {
    var id = { _id: req.params.libraryId };

    const updatedLibrary = await Library.findByIdAndUpdate(id, req.body, {
      new: true,
    })
      .select("-password")
      .select("-refreshToken");

    res.status(200).json(updatedLibrary);
  } catch (error) {
    res.status(403).send({
      error,
      message: "An error occured while updating, please try again",
    });
  }
};

//UPLOAD BOOK TO LIBRARY
exports.uploadBook = async (req, res) => {
  const {
    bookTitle,
    bookDescription,
    bookId,
    bookImage,
    library_that_owns_book,
  } = req.body;

  try {
    const newBook = await new Book.create({
      bookImage,
      bookTitle,
      bookId,
      bookDescription,
      library_that_owns_book,
    });

    const newBookSaved = await newBook.save();
    return res.status(200).json({
      message: "Book Created Successfully",
      bookDetails: newBookSaved,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.code,
      message: "An Error Occured While Saving Book",
    });
  }
};

//APPROVE OR DECLINE BOOK REQUEST
exports.approveOrDeclineBookRequest = async (req, res) => {
  const { action, libraryId, bookId } = req.body;
  const bookToBeBorrowed = await Book.findOne({ _id: bookId });

  if (libraryId === bookToBeBorrowed.library_that_owns_book) {
    try {
      if (action === "approve") {
        bookToBeBorrowed.date_borrowed = new Date.now();
        bookToBeBorrowed.status = "borrowed";
        bookToBeBorrowed.date_to_be_returned =
          bookToBeBorrowed.date_promised_by_borrower;
        return res.status(200).json({ message: "Book request was approved" });
      } else {
        bookToBeBorrowed.status = "available";
        bookToBeBorrowed.date_promised_by_borrower = "";
        bookToBeBorrowed.requester = "";
        return res.status(201).json({ message: "Book request was declined" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "An error occured while processing request, try again",
        error,
      });
    }
  } else {
    return res.status(403).json({
      message: "Library Does not own book, hence, it cannot update book status",
    });
  }
};

// MARK BOOK AS RETURNED
exports.markBookAsReturned = async (req, res) => {
  const { action, libraryId, bookId } = req.body;
  const bookToBeBorrowed = await Book.findOne({ _id: bookId });

  if (libraryId === bookToBeBorrowed.library_that_owns_book) {
    try {
      bookToBeBorrowed.status = "available";
      bookToBeBorrowed.date_promised_by_borrower = "";
      bookToBeBorrowed.date_to_be_returned = "";
      bookToBeBorrowed.requester = "";
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "An error occured while trying to mark book as returned",
      });
    }
  } else {
    return res.status(403).json({
      message: "Library Does not own book, hence, it cannot update book status",
    });
  }
};
