require("dotenv").config();

const express = require("express");
const multer = require("multer");
const path = require("path");

const authRoutes = require("./src/routers/auth");
const authenticateToken = require("./src/routers/authenticateToken");

const app = express();
const port = 3000;

//middleware
app.use(express.json());

//router
app.use("/", authRoutes);
app.get("/posts", authenticateToken, (req, res) => {
  res.json(req.user.name);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
