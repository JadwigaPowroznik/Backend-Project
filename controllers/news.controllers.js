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
  checkCommentIdExist,
  removeCommentById,
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

exports.deleteCommentById = async (req, res, next) => {
  try {
    let { comment_id } = req.params;
    await checkCommentIdExist(comment_id);
    await removeCommentById(comment_id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

exports.getEndpoints = (req, res) => {
  const endpointsJson = {
    "GET /api": {
      description:
        "returns a json representation of all the available endpoints of the api",
    },
    "GET /api/topics": {
      description: "returns an array of all topics",
      queries: [],
    },
    "GET /api/articles": {
      description: "returns an array of all articles",
      queries: ["sort_by", "order", "topic"],
    },
    "GET /api/articles/:article_id": {
      description: "returns an article of given id",
      queries: [],
    },
    "GET /api/articles/:article_id/comments": {
      description: "returns an array of all comments for a given article id",
      queries: [],
    },
    "GET /api/users": {
      description: "returns an array of all users",
      queries: [],
    },
    "PATCH /api/articles/:article_id": {
      description: "updates votes for an article of given id",
      queries: [],
    },
    "POST /api/articles/:article_id/comments": {
      description: "posts a new comment for an article of given id",
      queries: [],
    },
    "DELETE /api/comments/:comment_id": {
      description: "deletes a comment of a given id",
      queries: [],
    },
  };
  res.status(200).send(endpointsJson);
};
