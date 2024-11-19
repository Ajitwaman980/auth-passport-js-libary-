const passport = require("passport");
const authUser = (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log("auth failed and user is not logged in");
    // return res.redirect("/api/user/login");
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};
module.exports = authUser;
