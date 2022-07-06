const {
  fetchTopic,
  selectArticleById,
  updateArticleById,
  fetchUsers,
  fetchArticle,
  selectArticleCommentsById,
  addCommentByArticleId,
  checkUserExist,
  checkArticleIdExist,
  checkTopicExist,
} = require("../models/news.models.js");

exports.getTopics = (req, res, next) => {
  fetchTopic().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const updatedArticle = req.body;
  updateArticleById(article_id, updatedArticle)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getArticles = async (req, res, next) => {
  try {
    const { sort_by, order, topic } = req.query;
    await checkTopicExist(topic);
    const articles = await fetchArticle(sort_by, order, topic);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.getArticleCommentsById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleCommentsById(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const newComment = req.body;
    const username = req.body.username;
    await checkArticleIdExist(article_id);
    await checkUserExist(username);
    const comment = await addCommentByArticleId(article_id, newComment);
    res.status(200).send({ comment });
  } catch (err) {
    next(err);
  }
};
