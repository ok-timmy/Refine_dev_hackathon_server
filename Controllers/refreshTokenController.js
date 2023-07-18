const Library = require("../Models/Library");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");

//Handle User RefreshToken
exports.handleUserRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    res.sendStatus(401);
  } else {
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
      res.sendStatus(403);
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || decoded.email !== req.body.email) res.sendStatus(403);

        const accessToken = jwt.sign(
          {
            email: decoded.email,
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "200m",
          }
        );

        res.json({ accessToken });
      }
    );
  }
};

// Handle Librarian RefreshToken 
exports.handleLibrarianRefreshToken = async(req, res) => {
    const cookies = req.cookies;
  if (!cookies.jwt) {
    res.sendStatus(401);
  } else {
    const refreshToken = cookies.jwt;
    const foundLibrary = await Library.findOne({ refreshToken }).exec();

    if (!foundLibrary) {
      res.sendStatus(403);
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || decoded.email !== req.body.email) res.sendStatus(403);

        const accessToken = jwt.sign(
          {
            libraryEmail: decoded.email,
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "200m",
          }
        );

        res.json({ accessToken });
      }
    );
  }
}
