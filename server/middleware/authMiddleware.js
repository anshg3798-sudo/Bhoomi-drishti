const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "bhoomi-drishti-demo-secret-change-in-prod";

function protect(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not authorized - no token provided" });
  }
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Not authorized - invalid or expired token" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden - insufficient role" });
    }
    next();
  };
}

module.exports = { protect, requireRole, JWT_SECRET };
