const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { validationResult } = require("express-validator");
const saltRounds = 10;
const Library = require("../Models/Library");
const Book = require("../Models/Book")

// CREATE LIBRARY
exports.createLibrary = async (req, res) => {
    
};

//LOGIN TO LIBRARY
exports.loginToLibrary = async (req, res) => {};

//UPDATE LIBRARY DETAILS
exports.updateLibrary = async (req, res) => {};

//UPLOAD BOOK TO LIBRARY
exports.uploadBook = async(req, res) => {}

//APPROVE OR DECLINE BOOK REQUEST
exports.approveOrDeclineBookRequest = async (req, res) => {};

// MARK BOOK AS RETURNED
exports.markBookAsReturned = async (req, res) => {};

