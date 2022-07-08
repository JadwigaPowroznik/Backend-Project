const express = require("express");
const apiRouter = require("./routes/apiRouter");
const {
  getTopics,
  getArticleById,
  patchArticleById,
  getUsers,
  getArticles,
  getArticleCommentsById,
  postCommentByArticleId,
  deleteCommentById,
  getEndpoints,
  getStarted,
  getUsersByUsername,
  patchCommentById,
  postArticle,
  postTopic,
  deleteArticleById,
} = require("./controllers/news.controllers.js");

const app = express();

app.use(express.json());

app.get(app.path(), getStarted);

app.get("/api", getEndpoints);

app.use("/api", apiRouter);

//app.get("/api/topics", getTopics);
//app.post("/api/topics", postTopic);

// app.get("/api/articles", getArticles);
// app.post("/api/articles", postArticle);
// app.get("/api/articles/:article_id", getArticleById);
// app.patch("/api/articles/:article_id", patchArticleById);
// app.delete("/api/articles/:article_id", deleteArticleById);
// app.get("/api/articles/:article_id/comments", getArticleCommentsById);
// app.post("/api/articles/:article_id/comments", postCommentByArticleId);

// app.get("/api/users", getUsers);
// app.get("/api/users/:username", getUsersByUsername);

// app.delete("/api/comments/:comment_id", deleteCommentById);
// app.patch("/api/comments/:comment_id", patchCommentById);

app.use("*", (req, res) => {
  res.status(404).send({ msg: "Invalid path" });
});
app.use((err, req, res, next) => {
  if (typeof err === "string") {
    res.status(400).send({ msg: err });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err.status && err.errMessage) {
    res.status(err.status).send({ errMessage: err.errMessage });
  } else if (err.code === "22003") {
    res.status(404).send({ errMessage: `ID does not exist!` });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err.code) {
    res
      .status(400)
      .send({ errMessage: "Incorrect data type passed to endpoint" });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "server error" });
});

module.exports = app;
