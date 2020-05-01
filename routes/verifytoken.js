const jwt = require("jsonwebtoken");

const TOKEN_SECRET = "minvumin";

module.exports = function (req, res, next) {
  let token = null;
  try {
    // console.log(req.cookies);
    token = req.cookies.authToken;
  } catch (err) {
    console.log("doesnt exist token !!");
  }
  if (!token) return res.redirect("/login?error=accessDenied");

  try {
    // get playload of token => return {_id : id of user}
    const verified = jwt.verify(token, TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    // res.status(400).send('Invalid token');
    res.redirect("/login?error=InvalidToken");
  }
};
