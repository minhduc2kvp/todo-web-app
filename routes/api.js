const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const mailer = require("nodemailer");
const User = require("../model/user");
const Item = require("../model/item");
const { validation } = require("../config/validation");
const verify = require("./verifytoken");

const TOKEN_SECRET = "minvumin";

// SET UP MAILER TRANSPORTER
const transporter = mailer.createTransport({
  service: "gmail",
  auth: {
    user: "minhduc2kvp@gmail.com",
    pass: "mduc17062027",
  },
});

// --------- USER ROUTER ------------
// GET ALL USER
router.get("/user", (req, res) => {
  User.find((error, response) => {
    if (error) res.status(400).send("Found error !!!");
    res.send(response);
  });
});

// GET USER BY ID
router.get("/user/:id", verify,(req, res) => {
  const id = req.params.id;
  User.find({ _id: id }, (error, response) => {
    if (error) res.status(400).send("Found error !!!" + error);
    res.send(response);
  });
});

// POST USER ( REGISTER USER )
router.post("/user", async (req, res) => {
  // validation user
  const { error } = validation(req.body);
  if (error) return res.status(400).send(error);

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  // create user
  const user = new User(req.body);
  user.password = hashPassword;

  // save user
  await user.save((err, data) => {
    if (err) res.status(400).send("Save user failed");
    res.send(data);
  });
});

// UPDATE USER
router.put("/user/:id", verify, (req, res) => {
  const user = req.body;

  if (user.avatar) {
    const pathAvatar = `./public/image/avatar${req.params.id}.jpg`;
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
    user.avatar = `./image/avatar${req.params.id}.jpg`;
  }

  User.updateOne({ _id: req.params.id }, user, (err, data) => {
    if (err) res.status(400).send("Update user failed");
    res.send(data);
  });
});

// FORGOT PASSWORD => GET PASSWORD FOR USER
router.post("/forgot", async (req, res) => {
  // check user exist
  const user = await User.findOne(req.body, (err, response) => {
    if (err) res.redirect("/forgot?error=true");
  });
  if (!user) return res.redirect("/forgot?error=false");

  // console.log(user);

  // random password
  const password = crypto.randomBytes(10).toString("hex");
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  // send email
  const mailOption = {
    from: "TODO App Manager",
    to: user.email,
    subject: "Mật khẩu tài khoản TODO của bạn <3",
    html: `<h1>Mật khẩu mới của bạn : <strong>${password}</strong></h1>`,
  };
  transporter.sendMail(mailOption, (err, infor) => {
    // if(err){
    //   // console.log(err);
    //   return;
    // }else{
    //   // console.log(infor);
    // }
  });

  // update password for user
  User.updateOne(
    { _id: user._id },
    { password: hashPassword },
    (err, response) => {
      if (err) return res.redirect("/forgot?error=true");
      res.redirect("/login?error=forgot");
    }
  );
});

// CHANGE PASSWORD
router.post("/change-password", async (req, res) => {
  let token = null;
  let id = null;
  try {
    // console.log(req.cookies);
    token = req.cookies.authToken;
  } catch (err) {
    // console.log("doesnt exist token !!");
  }
  if (!token) return res.redirect("/login?error=accessDenied");

  try {
    // get playload of token => return {_id : id of user}
    const verified = jwt.verify(token, TOKEN_SECRET);
    id = verified._id;
  } catch (err) {
    // res.status(400).send('Invalid token');
    return res.redirect("/login?error=InvalidToken");
  }

  if (!id) return res.redirect("/login?error=accessDenied");

  const user = await User.findOne({ _id: id }, async (err, raw) => {
    if (err) {
      return res.redirect("/change-password?password=false");
    }
  });

  if (!user) return res.redirect("/login?error=accessDenied");

  let checkPass = await bcrypt.compare(req.body.oldpassword, user.password);
  if (!checkPass) return res.redirect("/change-password?password=false");

  if (!(req.body.password === req.body.password2)) {
    return res.redirect("/change-password?password=true");
  }

  if (!req.body.password.match(new RegExp("(?=.*[a-z])(?=.*[0-9])(?=.{8,})"))) {
    return res.redirect("/change-password?password=short");
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  // save new password
  User.updateOne({ _id: id }, { password: hashPassword }, (err, raw) => {
    if (err) return res.redirect("/change-password?password=true");
    res.clearCookie("authToken");
    res.redirect("/login?error=password");
  });
});

router.get('/profile-user', verify, (req, res) => {
  User.findOne({_id : req.user._id}, (err, raw) => {
    res.send(raw);
  });
});

// ----------- ITEM ROUTER ------------

router.get("/item", verify, (req, res) => {
  const userId = req.user._id;
  Item.find({userId : userId},(err, raw) => {
    if (err) return;
    res.send(raw);
  });
});

router.get("/item/:id", verify, (req, res) => {
  Item.findOne({ _id: req.params.id }, (err, raw) => {
    if (err) return;
    res.send(raw);
  });
});

router.post("/item", verify, async (req, res) => {
  const item = new Item({
    name: req.body.name,
    userId: req.user._id,
    deadline: req.body.deadline,
  });
  await item.save((err, raw) => {
    if (err) res.send("error");
    else res.send("success");
  });
});

router.put("/item/:id", verify, (req, res) => {
  Item.updateOne({ _id: req.params.id }, req.body, (err, raw) => {
    if (err) res.send("error");
    else res.send("success");
  });
});

router.delete("/item/:id", verify, (req, res) => {
  Item.deleteOne({ _id: req.params.id }, (err, raw) => {
    if (err) res.send("error");
    else res.send("success");
  });
});

module.exports = router;
