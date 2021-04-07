const { validationResult } = require("express-validator");
const db = require("../models");
const users = db.user;
const op = db.Sequelize.Op;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res
      .status(400)
      .json({ message: "inputan tidak sesusai", data: error.array() });
  }

  const hashPassword = await bcrypt.hash(req.body.password, 10);
  const user = {
    name: req.body.username,
    email: req.body.email,
    password: hashPassword,
    role: req.body.role ? req.body.role : 1,
  };

  users
    .create(user)
    .then((result) => {
      const getToken = {
        name: result.username,
        password: result.password,
      };
      const accessToken = jwt.sign(getToken, process.env.REFRESH_TOKEN_SECRET);

      const response = {
        name: result.username,
        email: result.email,
        role: result.role,
        accessToken: accessToken,
      };

      return res.status(201).json({
        message: "Create User Success",
        data: response,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error accured while creating user",
      });
    });
};
