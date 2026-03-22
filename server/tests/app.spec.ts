import request from "supertest";
import { faker } from "@faker-js/faker";
import app from "../src/app";
import datasource from "../src/datasource";

beforeAll(async () => {
  await datasource.initialize();
});

afterAll(async () => {
  await datasource.destroy();
});

describe("User API", () => {
  let email = faker.internet.email();
  let password = faker.internet.password();
  let token: string;

  it("should create a user account", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ email, password })
      .expect(201);

    expect(res.body.item).toBeDefined();
    expect(res.body.item.email).toBe(email);
    expect(res.body.item.id).toBeDefined();
  });

  it("should not allow creating a user with an already taken email", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ email, password: faker.internet.password() })
      .expect(400);

    expect(res.body.message).toMatch(/email already in use/i);
  });

  it("should not allow creating a user with an invalid email", async () => {
    const invalidEmail = "not-an-email";

    const res = await request(app)
      .post("/api/users")
      .send({ email: invalidEmail, password })
      .expect(400);

    expect(res.body.message).toMatch(/invalid email/i);
  });

  it("should login the user", async () => {
    const res = await request(app)
      .post("/api/users/tokens")
      .send({ email, password })
      .expect(200);

    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it("should get the user profile", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.item).toBeDefined();
    expect(res.body.item.email).toBe(email);
  });
});
