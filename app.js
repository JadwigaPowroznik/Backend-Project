const express = require("express");
const apiRouter = require("./routes/apiRouter");
const { getStarted } = require("./controllers/news.controllers.js");

const app = express();

app.use(express.json());

app.get(app.path(), getStarted);
app.use("/api", apiRouter);

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
