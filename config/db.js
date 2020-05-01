const mongoose = require("mongoose");

const url =
  "mongodb+srv://minhduc2kvp:mduc17062027@cluster-test-plqld.mongodb.net/todo?retryWrites=true&w=majority";

module.exports = mongoose.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if(err) throw err;
    console.log("Connected database...");
  }
);

// mongoose.disconnect().then(() => console.log("disconnect databases..."));
