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
      .json({ message: "inputan tidak sesuai", data: error.array() });
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
        email: result.email,
        password: result.password,
      };
      const accessToken = jwt.sign(getToken, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });

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

exports.login = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res
      .status(400)
      .json({ message: "inputan tidak sesuai", data: error.array() });
  }

  const data = {
    email: req.body.email,
    password: req.body.password,
  };

  const check = await users.findOne({
    where: {
      email: data.email,
    },
  });

  if (check) {
    bcrypt.compare(data.password, check.password, function (err, result) {
      if (err)
        return res.status(403).json({
          err,
        });

      const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });

      const response = {
        name: check.username,
        email: check.email,
        role: check.role,
        accessToken: accessToken,
      };

      return res.status(200).json({
        message: "Login User Success",
        data: response,
      });
    });
  } else {
    return res.status(403).json({
      message: "email tidak di temukan",
      data: data,
    });
  }
};
