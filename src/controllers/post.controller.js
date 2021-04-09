const { validationResult } = require("express-validator");
const db = require("../models");
const Op = db.Sequelize.Op;
const posts = db.post;

exports.createPost = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(402).json({
      message: "inputan tidak sesuai",
      data: error.array(),
    });
  }

  const post = {
    title: req.body.title,
    description: req.body.description,
    author: req.user,
  };

  posts
    .create(post)
    .then((result) => {
      return res.status(200).json({
        message: "Create Post Succes",
        data: result,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: err.message || "Some error accured while creating post",
      });
    });
};

exports.readPostById = (req, res) => {
  const id = req.params.id;

  posts
    .findByPk(id)
    .then((result) => {
      return res.status(200).json({
        data: result,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        message: "data tidak di temukan",
        data: err.message,
      });
    });
};

exports.readPost = (req, res) => {
  const title = req.query.title;
  let condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  posts
    .findAll({ where: condition })
    .then((result) => {
      return res.status(200).json({
        data: result,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        message: "data tidak di temukan",
        data: err.message,
      });
    });
};

exports.deletePost = (req, res, next) => {
  const id = req.params.id;

  posts
    .destroy({
      where: { id: id },
    })
    .then((result) => res.sendStatus(202))
    .catch((err) => {
      res.sendStatus(500);
    });
};

exports.updatePost = (req, res) => {
  const id = req.body.id;

  if (!id.isEmpty()) {
    res.status(403).json({
      message: "id tidak boleh kosong",
    });
  }

  const post = {
    title: req.body.title,
    description: req.body.description,
  };

  posts
    .update(post, {
      where: {
        id: id,
      },
    })
    .then((result) => {
      if (result === 1) {
        res.status(202).json({
          data: "Post was updated successfully",
        });
      } else {
        res.send({
          message: `Cannot update Post with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        data: err.message || "Some error accured while updating post",
      });
    });
};
