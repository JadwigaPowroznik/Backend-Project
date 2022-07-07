const express = require("express");
const topicsRouter = require("./topicsRouter");
const articlesRouter = require("./articlesRouter");
const usersRouter = require("./usersRouter");
const commentsRouter = require("./commentsRouter");
const getEndpoints = require("../controllers/news.controllers.js");

const apiRouter = express.Router();

//apiRouter.get("", getEndpoints);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
