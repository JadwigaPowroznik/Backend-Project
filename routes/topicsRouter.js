const { getTopics, postTopic } = require("../controllers/news.controllers.js");

const topicsRouter = require("express").Router();

topicsRouter.get("/", getTopics);
topicsRouter.post("/", postTopic);

module.exports = topicsRouter;
