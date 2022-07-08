\c nc_news_test

-- SELECT articles.*, COUNT (comments.comment_id) AS comment_count FROM comments LEFT JOIN articles ON articles.article_id = comments.article_id WHERE articles.article_id=2 GROUP BY comments.article_id;
-- UPDATE articles SET votes = votes + 10 WHERE article_id = 2 RETURNING *;

-- SELECT articles.*, COUNT(comment_id) AS comment_count FROM comments LEFT JOIN articles ON articles.article_id = comments.article_id WHERE articles.article_id=3 GROUP BY articles.article_id, comments.article_id;
--WHERE articles.article_id=2 
--GROUP BY comments.article_id;

-- SELECT articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, users.username AS author, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id=articles.article_id LEFT JOIN users ON users.username=articles.author GROUP BY articles.article_id, comments.article_id, users.username ORDER BY articles.created_at DESC

-- SELECT comments.comment_id, comments.votes, comments.created_at, comments.body, users.username AS author FROM comments LEFT JOIN users ON users.username=comments.author LEFT JOIN articles ON articles.article_id=comments.article_id WHERE articles.article_id = 7
--  SELECT * FROM comments;
-- INSERT INTO comments (author, body, article_id ) VALUES ('rogersop', 'aaa', 1) RETURNING comments.author AS username, comments.body

-- SELECT articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, users.username AS author, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id=articles.article_id LEFT JOIN users ON users.username=articles.author WHERE articles.topic = 'mitch' GROUP BY articles.article_id, comments.article_id, users.username ORDER BY article_id DESC 


SELECT articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, users.username AS author, COUNT(comment_id) AS comment_count, COUNT(articles.article_id) AS total_count FROM articles LEFT JOIN comments ON comments.article_id=articles.article_id LEFT JOIN users ON users.username=articles.author WHERE articles.topic = 'mitch' GROUP BY articles.article_id, comments.article_id, users.username ORDER BY created_at DESC ;
-- LIMIT 10 OFFSET (0)* 10
--  LIMIT ${limit} OFFSET (${p})* ${limit}
SELECT articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, users.username AS author, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id=articles.article_id LEFT JOIN users ON users.username=articles.author GROUP BY articles.article_id, comments.article_id, users.username ORDER BY created_at DESC LIMIT 10 OFFSET (1)* 10