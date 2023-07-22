const Library = require("../Models/Library");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");

//Handle User RefreshToken
exports.handleUserRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    res.status(401).json({ message: "Cookies Not found" });
  } else {
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
      res.status(403).json({ message: "No Library Found" });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || decoded.email !== req.body.email)
          res.status(403).json({ message: "Could Not verify" });

        const refreshToken = jwt.sign(
          {
            email: decoded.email,
          },
          process.env.REFRESH_TOKEN_SECRET,
          {
            expiresIn: "200m",
          }
        );

        return res.status(200).json({ accessToken: refreshToken });
      }
    );
  }
};

// Handle Librarian RefreshToken
exports.handleLibrarianRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.libraryCookie) {
    console.log("Cookies", req.cookies);
    return res.status(401).json({ message: "Cookies Not found" });
  } else {
    const refreshToken = cookies.libraryCookie;
    const foundLibrary = await Library.findOne({
      refreshToken,
    });
    console.log("foundLibrary", foundLibrary);
    if (foundLibrary === null) {
      return res.status(403).json({ message: "No Library Found" });
    } else {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
          if (err || decoded.libraryEmail !== req.body.libraryEmail) {
            return res.status(403).json({ message: "Could Not verify" });
          }

          const refreshToken = jwt.sign(
            {
              libraryEmail: decoded.email,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
              expiresIn: "200m",
            }
          );

          return res.status(200).json({ accessToken: refreshToken });
        }
      );
    }
  }
};
