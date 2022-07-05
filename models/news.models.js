const db = require("../db/connection.js");

exports.fetchTopic = () => {
  return db.query(`SELECT * FROM topics`).then((result) => {
    return result.rows;
  });
};

exports.selectArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          errMessage: `Article ID ${id} does not exist!`,
        });
      }
      return rows[0];
    });
};

exports.updateArticleById = (article_id, updatedArticle) => {
  if (!("inc_votes" in updatedArticle)) {
    return Promise.reject("Missing required fields!");
  }
  if (!(typeof updatedArticle.inc_votes === "number")) {
    return Promise.reject("Incorrect data type!");
  }
  const { inc_votes } = updatedArticle;
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [inc_votes, article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          errMessage: `Article ID ${article_id} does not exist!`,
        });
      }
      return result.rows[0];
    });
};

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then((result) => {
    return result.rows;
  });
};
