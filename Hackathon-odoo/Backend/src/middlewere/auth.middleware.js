const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("No token");
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  if (!token) return res.status(401).send("No token");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send("Invalid token");
  }
};