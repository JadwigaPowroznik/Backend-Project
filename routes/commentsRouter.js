const { deleteCommentById } = require("../controllers/news.controllers.js");

const commentsRouter = require("express").Router();

commentsRouter.delete("/", deleteCommentById);

module.exports = commentsRouter;
