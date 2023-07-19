const verifyLibrarian = (req, res, next) => {
  // Check if the req.email is equal to the librarian email
  if (req.email !== req.body.libraryEmail) {
    return res.sendStatus(403);
  }
  next();
};

module.exports = verifyLibrarian;
