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
