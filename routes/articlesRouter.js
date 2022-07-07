const {
  getArticles,
  getArticleById,
  patchArticleById,
  getArticleCommentsById,
  postCommentByArticleId,
} = require("../controllers/news.controllers.js");

const articlesRouter = require("express").Router();

articlesRouter.get("/", getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getArticleCommentsById)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
