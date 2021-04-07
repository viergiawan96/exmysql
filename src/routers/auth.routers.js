const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");

const authController = require("../controllers/auth.controller");

let refreshTokens = [];

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

router.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});

router.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

router.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "200s" });
}

module.exports = router;
