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
          body.topic.forEach((topic) =>
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
});