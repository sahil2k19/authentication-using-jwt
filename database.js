const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/testdatabase");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully to database");
});

const userSchema = mongoose.Schema({
  username: String,
  password: String,
});

const UserModel = mongoose.model("UserModel", userSchema);

module.exports = UserModel;
