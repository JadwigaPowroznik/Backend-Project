const db = require("../db/connection.js");

exports.fetchTopic = () => {
  return db.query(`SELECT * FROM topics`).then((result) => {
    return result.rows;
  });
};
