const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    const accessToken = token.split(" ")[1];
    jwt.verify(accessToken, process.env.JWT_SECRET_ACCESS, (err, user) => {
      if (err) {
        res.status(401).json({ message: "Token is not valid" });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "No token provided" });
  }
});

const checkAdmin = asyncHandler(async (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      res.status(401).json({ message: "User is not admin" });
    }
  });
});

module.exports = {
  verifyToken,
  checkAdmin
};
