\c nc_news

-- SELECT articles.*, COUNT (comments.comment_id) AS comment_count FROM comments LEFT JOIN articles ON articles.article_id = comments.article_id WHERE articles.article_id=2 GROUP BY comments.article_id;
-- UPDATE articles SET votes = votes + 10 WHERE article_id = 2 RETURNING *;

-- SELECT articles.*, COUNT(comment_id) AS comment_count FROM comments LEFT JOIN articles ON articles.article_id = comments.article_id WHERE articles.article_id=3 GROUP BY articles.article_id, comments.article_id;
--WHERE articles.article_id=2 
--GROUP BY comments.article_id;

SELECT articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, users.username AS author, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id=articles.article_id LEFT JOIN users ON users.username=articles.author GROUP BY articles.article_id, comments.article_id, users.username ORDER BY articles.created_at DESC