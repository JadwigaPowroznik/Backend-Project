const { getTopics } = require("../controllers/news.controllers.js");

const topicsRouter = require("express").Router();

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
