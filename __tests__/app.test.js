const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const {
  topicData,
  userData,
  articleData,
  commentData,
} = require("../db/data/test-data/");

beforeEach(() =>
  seed({
    topicData,
    userData,
    articleData,
    commentData,
  })
);

afterAll(() => {
  return db.end();
});

describe("my Express app", () => {
  describe("/api/topics", () => {
    it("200: returns an array of topic objects, each of which should have slug and description properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics.length > 0).toBe(true);
          body.topics.forEach((topic) =>
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            )
          );
        });
    });
    it("404: bad request response for invalid path", () => {
      return request(app)
        .get("/api/top")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid path");
        });
    });
  });
  describe("/api/articles/:article_id", () => {
    it("200: responds with an article object", () => {
      const article_id = 3;
      return request(app)
        .get(`/api/articles/${article_id}`)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual(
            expect.objectContaining({
              author: "icellusedkars",
              title: "Eight pug gifs that remind me of mitch",
              article_id: article_id,
              body: expect.any(String),
              topic: "mitch",
              created_at: "2020-11-03T09:12:00.000Z",
              votes: 0,
              comment_count: "2",
            })
          );
        });
    });
    it("400: bad request response for invalid path", () => {
      return request(app)
        .get("/api/articles/notAnID")
        .expect(400)
        .then(({ body }) => {
          const errMsg = body.errMessage;
          expect(errMsg).toBe("Bad data type passed to endpoint");
        });
    });
    it("404: bad request response for invalid article ID", () => {
      let id = 33333;
      return request(app)
        .get(`/api/articles/${id}`)
        .expect(404)
        .then(({ body }) => {
          const errMsg = body.errMessage;
          expect(errMsg).toBe(`Article ID ${id} does not exist!`);
        });
    });
    it("404: bad request response for ID value out of range", () => {
      let id = 5555555555555555555;
      return request(app)
        .get(`/api/articles/${id}`)
        .expect(404)
        .then(({ body }) => {
          const errMsg = body.errMessage;
          expect(errMsg).toBe(`Article ID does not exist!`);
        });
    });
  });
  describe("/api/articles/:article_id", () => {
    it("200: responds with the updated article object where votes are incremented by 10", () => {
      const article_id = 2;
      const articleUpdate = {
        inc_votes: 10,
      };
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send(articleUpdate)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual(
            expect.objectContaining({
              author: "icellusedkars",
              title: "Sony Vaio; or, The Laptop",
              article_id: article_id,
              body: expect.any(String),
              topic: "mitch",
              created_at: "2020-10-16T05:03:00.000Z",
              votes: 10,
            })
          );
        });
    });
    it("200: responds with the updated article object where votes are decremented by 10", () => {
      const article_id = 2;
      const articleUpdate = {
        inc_votes: -10,
      };
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send(articleUpdate)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual(
            expect.objectContaining({
              author: "icellusedkars",
              title: "Sony Vaio; or, The Laptop",
              article_id: article_id,
              body: expect.any(String),
              topic: "mitch",
              created_at: "2020-10-16T05:03:00.000Z",
              votes: -10,
            })
          );
        });
    });
    it("400: bad request response due to missing required fields", () => {
      let id = 2;
      const articleUpdate = {};
      return request(app)
        .patch(`/api/articles/${id}`)
        .send(articleUpdate)
        .expect(400)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe(`Missing required fields!`);
        });
    });
    it("400: bad request response due to incorrect data type", () => {
      let id = 2;
      const articleUpdate = { inc_votes: "increment" };
      return request(app)
        .patch(`/api/articles/${id}`)
        .send(articleUpdate)
        .expect(400)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe(`Incorrect data type!`);
        });
    });
    it("400: bad request response for invalid path", () => {
      const articleUpdate = {
        inc_votes: -10,
      };
      return request(app)
        .patch("/api/articles/notAnID")
        .send(articleUpdate)
        .expect(400)
        .then(({ body }) => {
          const errMsg = body.errMessage;
          expect(errMsg).toBe("Bad data type passed to endpoint");
        });
    });
    it("404: bad request response for invalid article ID", () => {
      let id = 33333;
      const articleUpdate = {
        inc_votes: -10,
      };
      return request(app)
        .patch(`/api/articles/${id}`)
        .send(articleUpdate)
        .expect(404)
        .then(({ body }) => {
          const errMsg = body.errMessage;
          expect(errMsg).toBe(`Article ID ${id} does not exist!`);
        });
    });
    it("404: bad request response for ID value out of range", () => {
      let id = 5555555555555555555;
      const articleUpdate = {
        inc_votes: -10,
      };
      return request(app)
        .patch(`/api/articles/${id}`)
        .send(articleUpdate)
        .expect(404)
        .then(({ body }) => {
          const errMsg = body.errMessage;
          expect(errMsg).toBe(`Article ID does not exist!`);
        });
    });
  });
  describe("/api/users", () => {
    it("200: returns an array of users objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users.length > 0).toBe(true);
          body.users.forEach((user) =>
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            )
          );
        });
    });
    it("404: bad request response for invalid path", () => {
      return request(app)
        .get("/api/us")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid path");
        });
    });
  });
  describe("/api/articles", () => {
    it("200: returns an articles array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length > 0).toBe(true);
          body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                votes: expect.any(Number),
                author: expect.any(String),
                comment_count: expect.any(String),
              })
            ),
              expect(article).toHaveProperty("created_at");
          });
        });
    });
    it("200: accepts order=desc and sort_by=created_at queries", () => {
      return request(app)
        .get("/api/articles?order=desc&sort_by=created_at")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    it("200: accepts order=asc and sort_by=article_id queries", () => {
      return request(app)
        .get("/api/articles?order=asc&sort_by=article_id")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("article_id", {
            descending: false,
            coerce: true,
          });
        });
    });
    it("200: accepts order=desc, sort_by=article_id adn topic queries", () => {
      return request(app)
        .get("/api/articles?order=desc&sort_by=article_id&topic=mitch")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("article_id", {
            descending: true,
            coerce: true,
          });
        });
    });
    it("404: bad request response for invalid topic", () => {
      return request(app)
        .get("/api/articles?order=desc&sort_by=article_id&topic=aaaaaaaa")
        .expect(404)
        .then(({ body: { errMessage } }) => {
          expect(errMessage).toBe("Topic: aaaaaaaa does not exist!");
        });
    });
    it("404: bad request response for invalid path", () => {
      return request(app)
        .get("/api/art")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid path");
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    it("200: responds with an array of comments for the given article_id", () => {
      const article_id = 1;
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(200)
        .then(({ body }) => {
          expect(body.comments[0]).toEqual({
            comment_id: 18,
            votes: 16,
            created_at: "2020-07-21T00:20:00.000Z",
            body: "This morning, I showered for nine minutes.",
            author: "butter_bridge",
          });
        });
    });
    it("400: bad request response for invalid path", () => {
      return request(app)
        .get("/api/articles/notAnID/comments")
        .expect(400)
        .then(({ body }) => {
          const errMsg = body.errMessage;
          expect(errMsg).toBe("Bad data type passed to endpoint");
        });
    });
    it("404: bad request response for invalid article ID", () => {
      let id = 33333;
      return request(app)
        .get(`/api/articles/${id}/comments`)
        .expect(404)
        .then(({ body }) => {
          const errMsg = body.errMessage;
          expect(errMsg).toBe(`Article ID ${id} does not exist!`);
        });
    });
    it("404: bad request response for ID value out of range", () => {
      let id = 5555555555555555555;
      return request(app)
        .get(`/api/articles/${id}/comments`)
        .expect(404)
        .then(({ body }) => {
          const errMsg = body.errMessage;
          expect(errMsg).toBe(`Article ID does not exist!`);
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    it("200: responds with the posted comment", () => {
      const article_id = 10;
      const newComment = {
        username: "rogersop",
        body: "very good",
      };
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(newComment)
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).toEqual({
            username: "rogersop",
            body: "very good",
          });
        });
    });
    it("400: bad request response due to missing required field", () => {
      let id = 2;
      const newComment = { username: "rogersop" };
      return request(app)
        .post(`/api/articles/${id}/comments`)
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe(`Missing required fields!`);
        });
    });
    it("400: bad request response due to missing required fields", () => {
      let id = 2;
      const newComment = {};
      return request(app)
        .post(`/api/articles/${id}/comments`)
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe(`Missing required fields!`);
        });
    });
    it("400: bad request response for invalid path", () => {
      const newComment = {
        username: "rogersop",
        body: "very good",
      };
      return request(app)
        .post("/api/articles/notAnID/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          const errMsg = body.errMessage;
          expect(errMsg).toBe("Bad data type passed to endpoint");
        });
    });
    it("404: bad request response due to invalid username", () => {
      let id = 2;
      const newComment = {
        username: "jadwiga",
        body: "very good",
      };
      return request(app)
        .post(`/api/articles/${id}/comments`)
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          const errMsg = body.errMessage;
          expect(errMsg).toBe(`Username not Found!`);
        });
    });
    it("404: bad request response for invalid article ID", () => {
      let id = 33333;
      const newComment = {
        username: "rogersop",
        body: "very good",
      };
      return request(app)
        .post(`/api/articles/${id}/comments`)
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          const errMsg = body.errMessage;
          expect(errMsg).toBe(`Article ID ${id} does not exist!`);
        });
    });
    it("404: bad request response for ID value out of range", () => {
      let id = 5555555555555555555;
      const newComment = {
        username: "rogersop",
        body: "very good",
      };
      return request(app)
        .post(`/api/articles/${id}/comments`)
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          const errMsg = body.errMessage;
          expect(errMsg).toBe(`Article ID does not exist!`);
        });
    });
  });
  describe("/api/comments/:comment_id", () => {
    it("204: responds with an empty response body and checks if comment has been deleted", () => {
      const id = 8;
      return request(app)
        .delete(`/api/comments/${id}`)
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
          return db
            .query(`SELECT * FROM comments WHERE comment_id =${id}`)
            .then((result) => {
              expect(result.rows.length).toBe(0);
            });
        });
    });
    it("404: bad request response due to invalid comment ID", () => {
      let id = 50;
      return request(app)
        .delete(`/api/comments/${id}`)
        .expect(404)
        .then(({ body }) => {
          const errMsg = body.errMessage;
          expect(errMsg).toBe(`Comment ID: ${id} does not exist!`);
        });
    });
    it("400: bad request response for invalid path", () => {
      return request(app)
        .delete("/api/comments/notAnID")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Incorrect data type passed to endpoint");
        });
    });
  });
  describe("/api", () => {
    it("200: responds with a JSON describing all the available endpoints on this API", () => {
      const endpointsJson = {
        "GET /api": {
          description:
            "returns a json representation of all the available endpoints of the api",
        },
        "GET /api/topics": {
          description: "returns an array of all topics",
          queries: [],
        },
        "GET /api/articles": {
          description: "returns an array of all articles",
          queries: ["sort_by", "order", "topic"],
        },
        "GET /api/articles/:article_id": {
          description: "returns an article of given id",
          queries: [],
        },
        "GET /api/articles/:article_id/comments": {
          description:
            "returns an array of all comments for a given article id",
          queries: [],
        },
        "GET /api/users": {
          description: "returns an array of all users",
          queries: [],
        },
        "PATCH /api/articles/:article_id": {
          description: "updates votes for an article of given id",
          queries: [],
        },
        "POST /api/articles/:article_id/comments": {
          description: "posts a new comment for an article of given id",
          queries: [],
        },
        "DELETE /api/comments/:comment_id": {
          description: "deletes a comment of a given id",
          queries: [],
        },
      };
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(endpointsJson);
        });
    });
  });
});
