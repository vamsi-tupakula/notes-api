const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

/**
 * @route /api/auth/signup
 * creates new user
 */
router.route("/signup").post((req, res) => {
  if (!req.body || !req.body.email || !req.body.password) {
    return res
      .status(400)
      .send({ ok: false, message: "All fields are required" });
  }

  bcrypt
    .hash(req.body.password, 10)
    .then(async (hashedPassword) => {
      const user = await userModel({
        email: req.body.email,
        password: hashedPassword,
      });

      user
        .save()
        .then((user_) => {
          res
            .status(201)
            .send({ status: "user created successfully", userId: user_._id });
        })
        .catch(() => {
          res
            .status(500)
            .send({ status: "error", message: "Error creating user." });
        });
    })
    .catch(() => {
      res
        .status(500)
        .send({ status: "error", message: "Error hashing the password." });
    });
});

/**
 * @route /api/auth/login
 * logs user into existing account
 */
router.route("/login").post((req, res) => {
  if (!req.body || !req.body.email || !req.body.password) {
    return res
      .status(400)
      .send({ ok: false, message: "All fields are required" });
  }

  userModel.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      return res
        .status(404)
        .send({ status: "error", message: "user not found" });
    }

    bcrypt
      .compare(req.body.password, user.password)
      .then((passwordCheck) => {
        if (!passwordCheck) {
          return res
            .status(400)
            .send({ status: "error", message: "invalid password" });
        }

        const token = jwt.sign(
          {
            userId: user._id,
            userEmail: user.email,
          },
          "RANDOM-TOKEN",
          { expiresIn: "24h" }
        );

        return res
          .status(200)
          .send({ message: "login successful", email: user.emai, token });
      })
      .catch(() => {
        return res
          .status(500)
          .send({ status: "error", message: "Internal server error" });
      });
  });
});

module.exports = router;
