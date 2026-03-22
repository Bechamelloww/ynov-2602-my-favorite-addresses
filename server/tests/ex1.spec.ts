import request from "supertest";
import app from "./mini-api";

describe("POST /countword", () => {
  it("returns the number of occurrences of the word in the text", async () => {
    const res = await request(app)
      .post("/countword")
      .send({ text: "hello world hello", word: "hello" })
      .expect(200);

    expect(res.body).toEqual({ count: 2 });
  });

  it("returns 0 when the word is not in the text", async () => {
    const res = await request(app)
      .post("/countword")
      .send({ text: "hello world", word: "foo" })
      .expect(200);

    expect(res.body).toEqual({ count: 0 });
  });

  it("returns 400 when text or word is missing", async () => {
    await request(app).post("/countword").send({ text: "hello" }).expect(400);

    await request(app).post("/countword").send({ word: "hello" }).expect(400);
  });

  it("returns 400 when word is empty", async () => {
    await request(app)
      .post("/countword")
      .send({ text: "hello world", word: "" })
      .expect(400);
  });
});
