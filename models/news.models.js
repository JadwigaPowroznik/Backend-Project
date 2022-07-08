const db = require("../db/connection.js");

exports.fetchTopic = () => {
  return db.query(`SELECT * FROM topics`).then((result) => {
    return result.rows;
  });
};

exports.selectArticleById = (id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comment_id) AS comment_count FROM comments LEFT JOIN articles ON articles.article_id = comments.article_id WHERE articles.article_id=$1 GROUP BY articles.article_id, comments.article_id`,
      [id]
    )
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

exports.fetchArticle = (
  sort_by = "created_at",
  order = "desc",
  limit = 10,
  p = 1,
  topic
) => {
  const sortOptions = [
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "author",
    "comment_count",
  ];
  const orderOptions = ["asc", "desc"];
  let topicStr = "";
  let limitStr = "";
  if (!sortOptions.includes(sort_by)) {
    return Promise.reject("Invalid sort query");
  }
  if (!orderOptions.includes(order)) {
    return Promise.reject("Invalid order query");
  }
  if (topic !== undefined) {
    topicStr = ` WHERE articles.topic = '${topic}'`;
  }
  if (p !== undefined) {
    limitStr = ` OFFSET (${p}-1)* ${limit}`;
  }
  return db
    .query(
      `SELECT articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, users.username AS author, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id=articles.article_id LEFT JOIN users ON users.username=articles.author${topicStr} GROUP BY articles.article_id, comments.article_id, users.username ORDER BY ${sort_by} ${order} LIMIT ${limit}${limitStr}`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectArticleCommentsById = (id, limit = 10, p = 1) => {
  return db
    .query(
      `SELECT comments.comment_id, comments.votes, comments.created_at, comments.body, users.username AS author FROM comments LEFT JOIN users ON users.username=comments.author LEFT JOIN articles ON articles.article_id=comments.article_id WHERE articles.article_id = $1 LIMIT ${limit} OFFSET (${p}-1)* ${limit}`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          errMessage: `Article ID ${id} does not exist!`,
        });
      }
      return rows;
    });
};

exports.addCommentByArticleId = (article_id, newComment) => {
  if (!("body" in newComment)) {
    return Promise.reject("Missing required fields!");
  }
  const { username, body } = newComment;
  return db
    .query(
      `INSERT INTO comments (author, body, article_id ) VALUES ($1, $2, $3) RETURNING comments.author AS username, comments.body`,
      [username, body, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.checkUserExist = (username) => {
  if (!username) return;
  return db
    .query("SELECT * FROM users WHERE username =$1", [username])
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          errMessage: "Username not Found!",
        });
      }
    });
};

exports.checkArticleIdExist = (article_id) => {
  if (!article_id) return;
  return db
    .query("SELECT * FROM articles WHERE article_id =$1", [article_id])
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          errMessage: `Article ID ${article_id} does not exist!`,
        });
      }
    });
};

exports.checkTopicExist = (topic) => {
  if (!topic) return;
  return db
    .query("SELECT * FROM articles WHERE topic =$1", [topic])
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          errMessage: `Topic: ${topic} does not exist!`,
        });
      }
    });
};

exports.checkCommentIdExist = (comment_id) => {
  if (!comment_id) return;
  if (!isNaN(comment_id)) {
    return db
      .query("SELECT * FROM comments WHERE comment_id =$1", [comment_id])
      .then(({ rowCount }) => {
        if (rowCount === 0) {
          return Promise.reject({
            status: 404,
            errMessage: `Comment ID: ${comment_id} does not exist!`,
          });
        }
      });
  } else {
    return Promise.reject("Incorrect data type passed to endpoint");
  }
};

exports.removeCommentById = (id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id=$1", [id])
    .then((result) => {
      return result;
    });
};

exports.fetchUser = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username='${username}'`)
    .then((result) => {
      return result.rows[0];
    });
};

exports.updateCommentById = (comment_id, updatedComment) => {
  if (!("inc_votes" in updatedComment)) {
    return Promise.reject("Missing required fields!");
  }
  if (!(typeof updatedComment.inc_votes === "number")) {
    return Promise.reject("Incorrect data type!");
  }
  const { inc_votes } = updatedComment;
  return db
    .query(
      "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;",
      [inc_votes, comment_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          errMessage: `Comment ID ${comment_id} does not exist!`,
        });
      }
      return result.rows[0];
    });
};

exports.addArticle = (newArticle) => {
  if (!("author" in newArticle && "topic" in newArticle)) {
    return Promise.reject("Missing required fields!");
  }
  if (!("title" in newArticle && "body" in newArticle)) {
    return Promise.reject("Missing required fields!");
  }
  const { author, title, body, topic } = newArticle;
  return db
    .query(
      `INSERT INTO articles (author, title, body, topic ) VALUES ($1, $2, $3, $4) RETURNING articles.article_id, articles.votes, articles.created_at, (SELECT COUNT(comment_id) AS comment_count FROM comments LEFT JOIN articles ON articles.article_id = comments.article_id WHERE articles.article_id=currval(pg_get_serial_sequence('articles','article_id')) GROUP BY articles.article_id, comments.article_id)`,
      [author, title, body, topic]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.addTopic = (newTopic) => {
  if (!("slug" in newTopic && "description" in newTopic)) {
    return Promise.reject("Missing required fields!");
  }
  const { slug, description } = newTopic;
  return db
    .query(
      `INSERT INTO topics (slug, description ) VALUES ($1, $2) RETURNING *`,
      [slug, description]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.removeArticleById = (article_id) => {
  return db
    .query("DELETE FROM articles WHERE article_id=$1", [article_id])
    .then((result) => {
      return result;
    });
};
