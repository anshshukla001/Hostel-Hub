const { validateToken } = require("../services/auth.services.js");

function checkForAuthentication(req, res, next) {
  if (req.url === "/user/signup" || req.url === "/user/login") {
    return next();
  }

  const token = req.header("Authorization")?.replace("Bearer ", "");
  req.user = null;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = validateToken(token);

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = user;
  next();
}

module.exports = { checkForAuthentication };