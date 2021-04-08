const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const postController = require("../controllers/post.controller");

router.post("/", [], postController.createPost);
