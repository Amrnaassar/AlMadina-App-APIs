const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token format is invalid" });
    }

    jwt.verify(token, "your_secret_key", (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
      req.userId = decoded.userId;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = authMiddleware;
