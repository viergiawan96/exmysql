const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const postController = require("../controllers/post.controller");

router.post(
  "/",
  [
    body("title")
      .notEmpty()
      .isLength({ min: 5 })
      .withMessage("inputan title tidak sesuai"),
    body("description")
      .notEmpty()
      .withMessage("inputan descripsi tidak boleh kosong"),
  ],
  postController.createPost
);

router.get("/:id", postController.readPostById);
router.get("/", postController.readPost);
router.delete("/:id", postController.deletePost);
router.put("/", postController.updatePost);

module.exports = router;
