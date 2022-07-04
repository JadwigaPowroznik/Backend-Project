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
});
