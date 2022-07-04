const { fetchTopic } = require("../models/news.models.js");

exports.getTopic = (req, res, next) => {
  fetchTopic().then((topic) => {
    res.status(200).send({ topic });
  });
};
