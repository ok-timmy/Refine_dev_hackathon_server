const router = require("express").Router();
const {
  fetchAllBooks,
  fetchSingleBook,
  fetchSingleBookBasedOnSearch,
} = require("../Controllers/bookController");

//FETCH ALL BOOKS
router.get("/", fetchAllBooks);

// FETCH SINGLE BOOK
router.get("/singleBook/:id", fetchSingleBook);

//FETCH BOOK BASED ON SEARCH
router.get("/singleBook/?bookTitle", fetchSingleBookBasedOnSearch);

module.exports = router;
