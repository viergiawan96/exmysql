require("dotenv").config();

const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");

const authRoutes = require("./src/routers/auth.routers");
const postRouter = require("./src/routers/post.router");
const authenticateToken = require("./src/routers/authenticateToken");
const db = require("./src/models");

const app = express();
const port = 3000;

//middleware
app.use(bodyParser.json());

//access agar tidak kena cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

//route
app.use("/api", authRoutes);
app.use("/api/post", authenticateToken, postRouter);

//sync database
db.sequelize.sync();

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
