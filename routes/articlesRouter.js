const {
  getArticles,
  postArticle,
  getArticleById,
  patchArticleById,
  getArticleCommentsById,
  postCommentByArticleId,
  deleteArticleById,
} = require("../controllers/news.controllers.js");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(deleteArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getArticleCommentsById)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
