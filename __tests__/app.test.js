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
      const article_id = 2;
      return request(app)
        .get(`/api/articles/${article_id}`)
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
              votes: 0,
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
});
