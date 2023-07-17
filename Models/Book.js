const mongoose = require("mongoose");

const { Schema } = mongoose;

const bookSchema = new mongoose.Schema(
  {
    bookName: {
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
    requester: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    date_requested: {
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
    },
    image: {
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
