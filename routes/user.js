const express = require("express");
const router = express.Router();
const usermodel = require("../model/user");
const passport = require("passport");
const express_validator = require("express-validator");
const authUser = require("../middleware/isauth");
const {
  handleValidationErrors,
  data_validator,
} = require("../middleware/datavalid");

// login ejs
router.get("/user/login", (req, res) => {
  res.render("../views/login.ejs");
});

router.post(
  "/user",

  async function (req, res) {
    try {
      const { username, password } = req.body;
      if (await usermodel.findOne({ username })) {
        return res.status(400).send("Username already exists go login");
        // return res.redirect("/api/user/login");
      }
      const newUser = new usermodel({
        username,
      });
      console.log(password);
      const userRegister = await usermodel.register(newUser, password);

      // res.redirect("/api/profile");

      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      res.redirect("/api/user");
      console.log(err);
    }
  }
);

router.post(
  "/user/login",
  passport.authenticate("local", {
    failureFlash: false,
    failureRedirect: "/api/user/login",
  }),

  async function (req, res) {
    try {
      const id = req.user._id; //taking the id form the sessions
      // console.log(req.user);
      if (req.user) {
        if (!(await usermodel.findById(id))) {
          return res.status(404).json({ message: "user not found" });
        }

        res.cookie("user", req.user._id, { httpOnly: true });
        return res
          .status(200)
          .json({ message: "user login successful", userID: id });
        // res.status(200).redirect(`/api/profile/${id}`);
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Error during login" });
    }
    // res.send("user login success");
  }
);
router.get("/user/logout", authUser, async function (req, res, next) {
  try {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie("user");
      res.status(201).redirect("/api/user/login");
      console.log("user logout success");
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error during logout" });
  }
});

// profile
router.get("/profile/:id", authUser, async (req, res) => {
  try {
    console.log(req.params.id);
    console.log("user profile success");
    const user = await usermodel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user);
    res.status(200).json({ user });
  } catch (err) {
    res.status(404).redirect("/user/login");
    console.log("user not login retry", err);
  }
});
// 672110e916616b01b3c79b62
// update the user profile
router.patch(
  "/user/rename-username/:userID",
  authUser,
  async function (req, res) {
    try {
      console.log("username is changed");
      const { newUsername } = req.body;
      const userID = req.params.userID;
      console.log(userID, "usernames", newUsername);
      const UpdateUsername = await usermodel.findByIdAndUpdate(userID, {
        username: newUsername,
      });
      console.log(UpdateUsername);
      // not found user
      if (!UpdateUsername) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({
        message: "Username updated successfully",
        userID: userID,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Error updating username" });
    }
  }
);
// update user password
router.patch(
  "/users/password-change/:userID",
  [
    express_validator
      .body("New_password", "New password must be at least 6 characters long")
      .isLength({ min: 6 }),
  ],
  async function (req, res) {
    console.log(req.params.userID);
    const userID = req.params.userID;
    const New_password = req.body.New_password;
    try {
      const user = await usermodel.findById(userID);
      if (!user) {
        console.log("user not found");
        return res.status(404).json({ message: "User not found" });
      }

      await user.setPassword(New_password);
      await user.save();

      return res.status(200).json({ userID: user._id });
    } catch (err) {
      console.log(err);
      console.log("Error updating password");
      res.status(500).redirect("user/login");
    }
  }
);
module.exports = router;
