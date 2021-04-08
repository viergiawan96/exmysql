const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const authController = require("../controllers/auth.controller");

router.post(
  "/register",
  [
    body("username")
      .isLength({ min: 5 })
      .withMessage("input nama tidak sesuai"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("input email tidak sesuai"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("input password tidak sesuai"),
  ],
  authController.register
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .notEmpty()
      .withMessage("input tidak boleh kosong"),
    body("password").notEmpty().withMessage("input tidak boleh kosong"),
  ],
  authController.login
);

module.exports = router;
