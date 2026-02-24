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
            .expect(200);

        expect(res.body.item).toBeDefined();
        expect(res.body.item.email).toBe(email);
        expect(res.body.item.id).toBeDefined();
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