\c nc_news

SELECT articles.*, COUNT () AS comment_count FROM articles WHERE article_id=2;
-- UPDATE articles SET votes = votes + 10 WHERE article_id = 2 RETURNING *;

