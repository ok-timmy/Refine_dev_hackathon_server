const Book = require("../Models/Book");

//FETCH ALL BOOKS
exports.fetchAllBooks = async (req, res) => {
  try {
    const allBooks = await Book.find();
    return res
      .status(200)
      .json({ message: "All Books gotten", data: allBooks });
  } catch (error) {
    return res
      .status(500)
      .json({ message: " An error occured plese try again" });
  }
};

//FETCH SINGLE BOOK
exports.fetchSingleBook = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);
    return res.status(200).json({ message: "Found Book", data: book });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An erro occured while fetching data" });
  }
};

//FETCH BOOK BASED ON SEARCH
exports.fetchSingleBookBasedOnSearch = async (req, res) => {};
