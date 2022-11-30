const express = require("express");
const app = express();
const { hashSync, compareSync } = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("./database");
const passport = require("passport");
require("./passport.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.post("/register", (req, res) => {
  const user = new UserModel({
    username: req.body.username,
    password: hashSync(req.body.password, 10),
  });
  user
    .save()
    .then((user) => {
      res.send({
        success: true,
        message: "user created",
        user: {
          id: user._id,
          username: user.username,
        },
      });
    })
    .catch((err) => {
      res.send({
        success: false,
        message: "kind of error",
        error: err,
      });
    });

  console.log("Register Post Request");
});

app.post("/login", (req, res) => {
  UserModel.findOne({
    username: req.body.username,
  }).then((user) => {
    //No user found
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Could not find the user.",
      });
    }

    // Incorrect password condition
    if (!compareSync(req.body.password, user.password)) {
      return res.status(401).send({
        success: false,
        message: "Incorrect Password",
      });
    }

    // creating jwt token

    const payload = {
      username: user.username,
      id: user._id,
    };
    const token = jwt.sign(payload, "Random string", { expiresIn: "1d" });
    return res.status(200).send({
      success: true,
      message: "Logged in succesfully",
      token: "Bearer " + token,
    });
  });
  console.log("Login post Request");
});

app.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.status(200).send({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
      },
    });
  }
);

app.listen(5000, () => {
  console.log("listen to port 5000");
});
