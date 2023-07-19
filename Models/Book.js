const mongoose = require("mongoose");

const { Schema } = mongoose;

const bookSchema = new mongoose.Schema(
  {
    bookTitle: {
      type: String,
      required: true,
    },
    bookDescription: {
      type: String,
      required: true,
    },
    bookId: {
      type: String,
      required: true,
    },
    library_that_owns_book: {
      type: Schema.Types.ObjectId,
      ref: "Library",
    },
    requester: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    date_requested: {
      type: Date,
    },
    date_promised_by_borrower: {
      type: Date,
    },
    date_borrowed: {
      type: Date,
    },
    date_to_be_returned: {
      type: Date,
    },
    status: {
      type: String,
      default: "available",
      //  Can be requested, borrowed, available
    },
    bookImage: {
      type: String,
      default:
        "https://i.pinimg.com/736x/a8/57/00/a85700f3c614f6313750b9d8196c08f5.jpg",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", bookSchema);
