const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const users = require("../controllers/users");

const passport = require("passport");
const user = require("../models/user");

//render the register form
router.get("/register", users.renderRegister);
//register a new user
router.post("/register", catchAsync(users.register));
//render login page
router.get("/login", users.renderLogin);
//login the user
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  users.login
);
//logout the user
router.get("/logout", users.logout);

module.exports = router;
