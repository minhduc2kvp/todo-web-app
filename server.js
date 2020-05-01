const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const db = require("./config/db"); // CONNECT DATABASE
const routerAPI = require("./routes/api");
const routerUser = require("./routes/user");

const mainController = require("./routes/controller/main");

const app = express();

// MIDDLEWARE SET UP
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(cookieParser());

// SET UP VIEW ENGINE
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// SET HEADER CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", ["*"]);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// SET UP ROUTER
app.use("/api", routerAPI);
app.use(routerUser);

// SET CONTROLLER
app.use(mainController);

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server running on port " + PORT));
