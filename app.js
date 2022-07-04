/*
Responds with:

an array of topic objects, each of which should have the following properties:
slug
description
As this is the first endpoint you will need to set up your testing suite.

Errors handled.
*/
const express = require("express");
const { getTopic } = require("./controllers/news.controllers.js");
const app = express();

app.get("/api/topics", getTopic);

app.use("*", (req, res) => {
  res.status(404).send({ msg: "Invalid path" });
});

app.use((err, req, res, next) => {
  //console.log(err, "<<< inside 500 handler");
  res.status(500).send({ msg: "server error" });
});

module.exports = app;
