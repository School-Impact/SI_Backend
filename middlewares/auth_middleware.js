const jwt = require("jsonwebtoken"); // JWT library

// Middleware for token verify
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(403).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    console.log(err);
    if (err) return res.status(403).json({ message: "Unauthorized" });

    // Save the payload data
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
