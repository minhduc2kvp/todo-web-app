const express = require("express");
const router = express.Router();
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const TOKEN_SECRET = "minvumin";

// LOGIN
router.post("/login", async (req, res) => {
  // find username
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.redirect("/login?error=true");

  // compare password
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.redirect("/login?error=true");

  // login success
  const token = jwt.sign({ _id: user._id }, TOKEN_SECRET);
  // set cookie for login
  res
    .cookie("authToken", token, { maxAge: 9999999 })
    .redirect("/");
});

// REGISTER
router.post("/register", async (req, res) => {
  let user = req.body;

  // check username
  const u = await User.findOne({ username: user.username });
  if (u) return res.send("error");

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(user.password, salt);
  user.password = hashPassword;

  // save avatar
  if (user.avatar) {
    const pathAvatar = `./public/image/avatar${user.username}.jpg`;
    var matches = user.avatar.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches.length !== 3) {
      return res.send("error");
    }
    const data = new Buffer(matches[2], "base64");
    fs.writeFile(pathAvatar, data, (err) => {
      if (err) {
        console.log(err);
        return res.send("error");
      }
    });
    user.avatar = `./image/avatar${user.username}.jpg`;
  }

  // create new user
  const newUser = new User(user);

  // save to database
  await newUser
    .save()
    .then((data) => {
      console.log("save user success");
      res.send("success");
    })
    .catch((err) => {
      console.log("error from save user");
      console.log(err);
      res.send("error");
    });
});

module.exports = router;
