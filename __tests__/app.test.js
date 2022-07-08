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
          expect(errMsg).toBe("Incorrect data type passed to endpoint");
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
          expect(errMsg).toBe(`ID does not exist!`);
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
          expect(errMsg).toBe("Incorrect data type passed to endpoint");
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
          expect(errMsg).toBe(`ID does not exist!`);
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
          expect(body.articles.length).toBe(10);
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
    it("200: accepts order=desc, sort_by=article_id and topic queries", () => {
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
    it("200: accepts limit=10 and p=1 queries", () => {
      return request(app)
        .get("/api/articles?limit=10&p=1")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(10);
        });
    });
    it("200: accepts limit=10 and p=2 queries", () => {
      return request(app)
        .get("/api/articles?limit=10&p=2")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(2);
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
    it("200: responds with an array of comments for the given article_id, page 1", () => {
      const article_id = 1;
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).toBe(10);
          expect(body.comments[0]).toEqual({
            comment_id: 18,
            votes: 16,
            created_at: "2020-07-21T00:20:00.000Z",
            body: "This morning, I showered for nine minutes.",
            author: "butter_bridge",
          });
        });
    });
    it("200: responds with an array of comments for the given article_id, page 2", () => {
      const article_id = 1;
      return request(app)
        .get(`/api/articles/${article_id}/comments?p=2`)
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).toBe(1);
          expect(body.comments[0]).toEqual({
            comment_id: 3,
            votes: 100,
            created_at: "2020-03-01T01:13:00.000Z",
            body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
            author: "icellusedkars",
          });
        });
    });
    it("400: bad request response for invalid path", () => {
      return request(app)
        .get("/api/articles/notAnID/comments")
        .expect(400)
        .then(({ body }) => {
          const errMsg = body.errMessage;
          expect(errMsg).toBe("Incorrect data type passed to endpoint");
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
          expect(errMsg).toBe(`ID does not exist!`);
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
          expect(errMsg).toBe("Incorrect data type passed to endpoint");
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
          expect(errMsg).toBe(`ID does not exist!`);
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
        "POST /api/topics": {
          description: "returns a newly added topic",
          queries: [],
        },
        "GET /api/articles": {
          description: "returns an array of all articles",
          queries: ["sort_by", "order", "topic", "limit", "p"],
        },
        "POST /api/articles": {
          description: "returns a newly added article",
          queries: [],
        },
        "GET /api/articles/:article_id": {
          description: "returns an article of given id",
          queries: [],
        },
        "PATCH /api/articles/:article_id": {
          description: "updates votes for an article of given id",
          queries: [],
        },
        "DELETE /api/articles/:article_id": {
          description: "deletesthe given article by article_id",
          queries: [],
        },
        "POST /api/articles/:article_id/comments": {
          description: "posts a new comment for an article of given id",
          queries: [],
        },
        "GET /api/articles/:article_id/comments": {
          description:
            "returns an array of all comments for a given article id",
          queries: ["limit", "p"],
        },
        "GET /api/users": {
          description: "returns an array of all users",
          queries: [],
        },
        "GET /api/users/:username": {
          description: "returns an object of given user",
          queries: [],
        },
        "DELETE /api/comments/:comment_id": {
          description: "deletes a comment of a given id",
          queries: [],
        },
        "PATCH /api/comments/:comment_id": {
          description: "updates a comment of a given id",
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
  describe("", () => {
    it("200: responds with a welcome message", () => {
      const welcome =
        "Welcome!\nUse https://news-nc-jadwiga.herokuapp.com/api to access all available endpoints";
      return request(app)
        .get(app.path())
        .expect(200)
        .then(({ body }) => {
          expect(body.welcome).toBe(welcome);
        });
    });
  });
  describe("/api/users/:username", () => {
    it("200: responds with username details", () => {
      const username = "rogersop";
      return request(app)
        .get(`/api/users/${username}`)
        .expect(200)
        .then(({ body }) => {
          expect(body.user).toEqual({
            username: "rogersop",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
            name: "paul",
          });
        });
    });
    it("400: bad request response for invalid path", () => {
      const username = "rogersop";
      return request(app)
        .get(`/api/person/${username}`)
        .expect(404)
        .then(({ body }) => {
          const msg = body.msg;
          expect(msg).toBe("Invalid path");
        });
    });
    it("404: bad request response due to invalid username", () => {
      const username = "jadwiga";
      return request(app)
        .get(`/api/users/${username}`)
        .expect(404)
        .then(({ body }) => {
          const errMsg = body.errMessage;
          expect(errMsg).toBe(`Username not Found!`);
        });
    });
  });
  describe("/api/comments/:comment_id", () => {
    it("200: responds with the updated comment object where votes are incremented", () => {
      const comment_id = 1;
      const commentUpdate = {
        inc_votes: 4,
      };
      return request(app)
        .patch(`/api/comments/${comment_id}`)
        .send(commentUpdate)
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).toEqual(
            expect.objectContaining({
              comment_id: comment_id,
              body: expect.any(String),
              article_id: 9,
              author: "butter_bridge",
              votes: 20,
              created_at: expect.any(String),
            })
          );
        });
    });
    it("200: responds with the updated article object where votes are decremented", () => {
      const comment_id = 1;
      const commentUpdate = {
        inc_votes: -6,
      };
      return request(app)
        .patch(`/api/comments/${comment_id}`)
        .send(commentUpdate)
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).toEqual(
            expect.objectContaining({
              comment_id: comment_id,
              body: expect.any(String),
              article_id: 9,
              author: "butter_bridge",
              votes: 10,
              created_at: expect.any(String),
            })
          );
        });
    });
    it("400: bad request response due to missing required fields", () => {
      let id = 2;
      const commentUpdate = {};
      return request(app)
        .patch(`/api/comments/${id}`)
        .send(commentUpdate)
        .expect(400)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe(`Missing required fields!`);
        });
    });
    it("400: bad request response due to incorrect data type", () => {
      let id = 2;
      const commentUpdate = { inc_votes: "increment" };
      return request(app)
        .patch(`/api/comments/${id}`)
        .send(commentUpdate)
        .expect(400)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe(`Incorrect data type!`);
        });
    });
    it("400: bad request response for invalid path", () => {
      const commentUpdate = {
        inc_votes: -10,
      };
      return request(app)
        .patch("/api/comments/notAnID")
        .send(commentUpdate)
        .expect(400)
        .then(({ body }) => {
          const errMsg = body.errMessage;
          expect(errMsg).toBe("Incorrect data type passed to endpoint");
        });
    });
    it("404: bad request response for invalid article ID", () => {
      let id = 33333;
      const commentUpdate = {
        inc_votes: -10,
      };
      return request(app)
        .patch(`/api/comments/${id}`)
        .send(commentUpdate)
        .expect(404)
        .then(({ body }) => {
          const errMsg = body.errMessage;
          expect(errMsg).toBe(`Comment ID ${id} does not exist!`);
        });
    });
    it("404: bad request response for ID value out of range", () => {
      let id = 5555555555555555555;
      const commentUpdate = {
        inc_votes: -10,
      };
      return request(app)
        .patch(`/api/comments/${id}`)
        .send(commentUpdate)
        .expect(404)
        .then(({ body }) => {
          const errMsg = body.errMessage;
          expect(errMsg).toBe(`ID does not exist!`);
        });
    });
  });
  describe("/api/articles", () => {
    it("200: responds with the posted article", () => {
      const newArticle = {
        author: "butter_bridge",
        title: "nothing",
        body: "something to tell",
        topic: "mitch",
      };
      const resArticle = {
        article_id: expect.any(Number),
        votes: 0,
        created_at: expect.any(String),
        comment_count: null,
      };
      return request(app)
        .post(`/api/articles`)
        .send(newArticle)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual(resArticle);
        });
    });
    it("400: bad request response due to missing required field", () => {
      const newArticle = {
        author: "butter_bridge",
        title: "nothing",
        topic: "mitch",
      };
      return request(app)
        .post(`/api/articles`)
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe(`Missing required fields!`);
        });
    });
    it("400: bad request response due to missing required field", () => {
      const newArticle = {
        author: "butter_bridge",
        title: "nothing",
        body: "something to tell",
      };
      return request(app)
        .post(`/api/articles`)
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe(`Missing required fields!`);
        });
    });
    it("400: bad request response for invalid path", () => {
      const newArticle = {
        author: "butter_bridge",
        title: "nothing",
        body: "something to tell",
        topic: "mitch",
      };
      return request(app)
        .post("/api/NOTarticles")
        .send(newArticle)
        .expect(404)
        .then(({ body }) => {
          const msg = body.msg;
          expect(msg).toBe("Invalid path");
        });
    });
    it("404: bad request response due to invalid username", () => {
      const newArticle = {
        author: "jadwiga",
        title: "nothing",
        body: "something to tell",
        topic: "mitch",
      };
      return request(app)
        .post(`/api/articles`)
        .send(newArticle)
        .expect(404)
        .then(({ body }) => {
          const errMsg = body.errMessage;
          expect(errMsg).toBe(`Username not Found!`);
        });
    });
    it("404: bad request response due to invalid topic", () => {
      const newArticle = {
        author: "butter_bridge",
        title: "nothing",
        body: "something to tell",
        topic: "nothingggggggggggggg",
      };
      return request(app)
        .post(`/api/articles`)
        .send(newArticle)
        .expect(404)
        .then(({ body }) => {
          const errMsg = body.errMessage;
          expect(errMsg).toBe(`Topic: nothingggggggggggggg does not exist!`);
        });
    });
  });
  describe("/api/topics", () => {
    it("200: responds with the posted article", () => {
      const newTopic = {
        slug: "something new",
        description: "something new has been added!",
      };
      return request(app)
        .post(`/api/topics`)
        .send(newTopic)
        .expect(200)
        .then(({ body }) => {
          expect(body.topic).toEqual(newTopic);
        });
    });
    it("400: bad request response due to missing required field", () => {
      const newTopic = {
        description: "something new has been added!",
      };
      return request(app)
        .post(`/api/topics`)
        .send(newTopic)
        .expect(400)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe(`Missing required fields!`);
        });
    });
    it("400: bad request response due to missing required field", () => {
      const newArticle = {};
      return request(app)
        .post(`/api/topics`)
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe(`Missing required fields!`);
        });
    });
    it("400: bad request response for invalid path", () => {
      const newTopic = {
        slug: "something new",
        description: "something new has been added!",
      };
      return request(app)
        .post("/api/NOT")
        .send(newTopic)
        .expect(404)
        .then(({ body }) => {
          const msg = body.msg;
          expect(msg).toBe("Invalid path");
        });
    });
  });
  describe("/api/articles/:article_id", () => {
    it("204: responds with an empty response body and checks if article has been deleted", () => {
      const id = 8;
      return request(app)
        .delete(`/api/articles/${id}`)
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
          return db
            .query(`SELECT * FROM articles WHERE article_id =${id}`)
            .then((result) => {
              expect(result.rows.length).toBe(0);
            });
        });
    });
    it("404: bad request response due to invalid comment ID", () => {
      let id = 50;
      return request(app)
        .delete(`/api/articles/${id}`)
        .expect(404)
        .then(({ body }) => {
          const errMsg = body.errMessage;
          expect(errMsg).toBe(`Article ID ${id} does not exist!`);
        });
    });
    it("400: bad request response for invalid path", () => {
      return request(app)
        .delete("/api/articles/notAnID")
        .expect(400)
        .then(({ body: { errMessage } }) => {
          expect(errMessage).toBe("Incorrect data type passed to endpoint");
        });
    });
  });
});
