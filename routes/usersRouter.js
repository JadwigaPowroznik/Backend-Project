const { getUsers } = require("../controllers/news.controllers.js");

const usersRouter = require("express").Router();

usersRouter.get("/", getUsers);

module.exports = usersRouter;
