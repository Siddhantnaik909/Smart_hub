const jwt = require("jsonwebtoken");
const { config } = require("../config/env");

function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded.user || decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Unauthenticated" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    return next();
  };
}

module.exports = { authRequired, allowRoles };
