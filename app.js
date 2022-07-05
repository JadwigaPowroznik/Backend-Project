const express = require("express");
const {
  getTopics,
  getArticleById,
} = require("./controllers/news.controllers.js");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

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
  console.log(err, "<---- in first error handler");
  if (err.status && err.errMessage) {
    res.status(err.status).send({ errMessage: err.errMessage });
  } else if (err.code === "22003") {
    res.status(404).send({ errMessage: `Article ID does not exist!` });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err.code) {
    console.log(err, "<---- it is a PSQL error");
    res.status(400).send({ errMessage: "Bad data type passed to endpoint" });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  console.log(err, "<<< inside 500 handler");
  res.status(500).send({ msg: "server error" });
});

module.exports = app;
