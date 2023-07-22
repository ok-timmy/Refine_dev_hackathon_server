const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { validationResult } = require("express-validator");
const saltRounds = 10;
const Library = require("../Models/Library");
const Book = require("../Models/Book");
const User = require("../Models/User");

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
          { expiresIn: "2h" }
        );

        const refreshToken = jwt.sign(
          { libraryEmail: foundLibrary.email },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );

        foundLibrary.refreshToken = refreshToken;
        await foundLibrary.save();

        res.cookie("libraryCookie", refreshToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24,
          sameSite: "None",
          secure: true,
        });
        const foundLibraryExceptPassword = await Library.findOne({
          email: req.body.email,
        })
          .select("-password")
          .select("-refreshToken");

        res.status(200).json({
          data: foundLibraryExceptPassword,
          accessToken,
        });
      } else {
        res.status(401).json({ error: "Incorrect Password" });
      }
    } else {
      res.status(401).send({ message: "Library does not exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "An Error occured while trying to login" });
  }
};

// GET LIBRARY DATA FOR LIBRARY DASHBOARD
exports.getLibraryData = async (req, res) => {
  const { libraryEmail } = req.params;
  console.log(libraryEmail);
  try {
    const foundLibrary = await Library.findOne({ email: libraryEmail })
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
  const { libraryId, libraryEmail } = req.body;
  try {
    const allBooks = await Book.find();
    const requestedBooks = allBooks.map((book) => {
      return book.library_that_owns_book === libraryId && book.requester != "";
    });
    const populatedRequestedBooks = requestedBooks.populate(
      "requester",
      "firstName lastName email bio address phoneNumber image"
    );
    return res.status(200).json({
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
    const newBook = await new Book({
      bookImage,
      bookTitle,
      bookId,
      bookDescription,
      library_that_owns_book,
    });

    const newBookSaved = await newBook.save();
    const newBookId = newBook._id.valueOf();

    await Library.findByIdAndUpdate(library_that_owns_book, {
      $push: {
        availableBooks: newBookId,
      },
    });
    return res.status(200).json({
      message: "Book Created Successfully",
      bookDetails: newBookSaved,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errorCode: error.code,
      message: "An Error Occured While Saving Book",
    });
  }
};

//APPROVE OR DECLINE BOOK REQUEST
exports.approveOrDeclineBookRequest = async (req, res) => {
  const { action, libraryId, bookId, libraryEmail } = req.body;
  const bookToBeBorrowed = await Book.findOne({ _id: bookId });

  if (libraryId === bookToBeBorrowed.library_that_owns_book.valueOf()) {
    try {
      if (action === "approve") {
        const approvedRequestedBook = await bookToBeBorrowed.updateOne(
          {
            $set: {
              date_borrowed: Date.now(),
              status: "borrowed",
              date_to_be_returned: bookToBeBorrowed.date_promised_by_borrower,
            },
          },
          {
            new: true,
          }
        );

        await User.findByIdAndUpdate(bookToBeBorrowed.requester.valueOf(), {
          $pull: {
            booksRequested: bookId,
          },
          $push: {
            booksBorrowed: bookId,
          },
        });

        return res.status(200).json({
          message: "Book request was approved",
          data: approvedRequestedBook,
        });
      } else {
        const declinedRequestedBook = await bookToBeBorrowed.updateOne(
          {
            $set: {
              status: "available",
            },
            $unset: {
              requester: "",
              date_to_be_returned: null,
              date_borrowed: null,
            },
          },
          {
            new: true,
          }
        );

        //Update the borrowers borrowed list here
        await User.findByIdAndUpdate(bookToBeBorrowed.requester.valueOf(), {
          $pull: {
            $pull: {
              booksRequested: bookId,
            },
          },
        });

        return res.status(201).json({
          message: "Book request was declined",
          data: declinedRequestedBook,
        });
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
  const { libraryId, bookId } = req.body;
  const bookToBeBorrowed = await Book.findOne({ _id: bookId });

  if (libraryId === bookToBeBorrowed.library_that_owns_book.valueOf()) {
    try {
      const returnedBook = await bookToBeBorrowed.updateOne(
        {
          $set: {
            status: "available",
          },
          $unset: {
            date_promised_by_borrower: "",
            date_to_be_returned: "",
            requester: "",
            date_requested: "",
            date_borrowed: "",
          },
        },
        {
          new: true,
        }
      );

      //Update user borrowed list here
      await User.findByIdAndUpdate(bookToBeBorrowed.requester.valueOf(), {
        $pull: {
          booksBorrowed: bookId,
        },
      });

      return res.status(200).json({
        message: "Book Was successfully marked as returned",
        data: returnedBook,
      });
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
