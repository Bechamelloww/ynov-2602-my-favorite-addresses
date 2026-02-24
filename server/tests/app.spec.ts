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

describe("POST /api/users", () => {
    it("should create a user account", async () => {
        const email = faker.internet.email();
        const password = faker.internet.password();

        const res = await request(app)
            .post("/api/users")
            .send({ email, password })
            .expect(200);

        expect(res.body.item).toBeDefined();
        expect(res.body.item.email).toBe(email);
        expect(res.body.item.id).toBeDefined();
    });
});