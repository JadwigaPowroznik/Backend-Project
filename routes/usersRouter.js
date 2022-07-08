const {
  getUsers,
  getUsersByUsername,
} = require("../controllers/news.controllers.js");

const usersRouter = require("express").Router();

usersRouter.get("/", getUsers);
usersRouter.get("/:username", getUsersByUsername);

module.exports = usersRouter;
