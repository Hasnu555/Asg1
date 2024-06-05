const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Access denied: Admin permissions required." });
  }
  next();
};

const requireAuth = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decodedToken = jwt.verify(token, "hasan secret");
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

const checkUser = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decodedToken = jwt.verify(token, "hasan secret");
      const user = await User.findById(decodedToken.id);
      if (user) {
        res.locals.user = {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      } else {
        res.locals.user = null;
      }
    } catch (err) {
      console.error("Error verifying token:", err.message);
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
};

module.exports = { requireAuth, checkUser, requireAdmin };
