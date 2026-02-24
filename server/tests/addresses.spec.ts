import request from "supertest";
import { faker } from "@faker-js/faker";
import app from "../src/app";
import datasource from "../src/datasource";
import { getCoordinatesFromSearch } from "../src/utils/getCoordinatesFromSearch";

jest.mock("../src/utils/getCoordinatesFromSearch", () => ({
  getCoordinatesFromSearch: jest.fn(),
}));

const mockedGetCoordinates = getCoordinatesFromSearch as jest.MockedFunction<
  typeof getCoordinatesFromSearch
>;

beforeAll(async () => {
  await datasource.initialize();
});

afterAll(async () => {
  await datasource.destroy();
});

describe("Addresses API", () => {
  let token: string;

  beforeAll(async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    await request(app).post("/api/users").send({ email, password });
    const loginRes = await request(app)
      .post("/api/users/tokens")
      .send({ email, password });
    token = loginRes.body.token;
  });

  describe("GET /api/addresses", () => {
    it("returns 403 without auth", async () => {
      await request(app).get("/api/addresses").expect(403);
    });

    it("returns 200 and items array with auth", async () => {
      const res = await request(app)
        .get("/api/addresses")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      expect(res.body.items).toBeDefined();
      expect(Array.isArray(res.body.items)).toBe(true);
    });
  });

  describe("POST /api/addresses", () => {
    it("returns 403 without auth", async () => {
      await request(app)
        .post("/api/addresses")
        .send({ searchWord: "Paris", name: "Chez moi", description: "Appart" })
        .expect(403);
    });

    it("returns 400 when name is missing", async () => {
      const res = await request(app)
        .post("/api/addresses")
        .set("Authorization", `Bearer ${token}`)
        .send({ searchWord: "Paris", description: "Appart" })
        .expect(400);
      expect(res.body.message).toMatch(/name and search word are required/);
    });

    it("returns 400 when searchWord is missing", async () => {
      await request(app)
        .post("/api/addresses")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Chez moi", description: "Appart" })
        .expect(400);
    });

    it("returns 404 when search word not found", async () => {
      mockedGetCoordinates.mockResolvedValue(null);
      const res = await request(app)
        .post("/api/addresses")
        .set("Authorization", `Bearer ${token}`)
        .send({ searchWord: "xyznowhere123", name: "Test" })
        .expect(404);
      expect(res.body.message).toMatch(/search word not found/);
    });

    it("returns 200 and item when coordinates found", async () => {
      mockedGetCoordinates.mockResolvedValue({ lat: 48.8566, lng: 2.3522 });
      const res = await request(app)
        .post("/api/addresses")
        .set("Authorization", `Bearer ${token}`)
        .send({
          searchWord: "Paris",
          name: "Paris",
          description: "Capitale",
        })
        .expect(200);
      expect(res.body.item).toBeDefined();
      expect(res.body.item.name).toBe("Paris");
      expect(res.body.item.lat).toBe(48.8566);
      expect(res.body.item.lng).toBe(2.3522);
    });
  });

  describe("POST /api/addresses/searches", () => {
    it("returns 403 without auth", async () => {
      await request(app)
        .post("/api/addresses/searches")
        .send({ radius: 10, from: { lat: 48.8, lng: 2.3 } })
        .expect(403);
    });

    it("returns 400 when radius is missing", async () => {
      const res = await request(app)
        .post("/api/addresses/searches")
        .set("Authorization", `Bearer ${token}`)
        .send({ from: { lat: 48.8, lng: 2.3 } })
        .expect(400);
      expect(res.body.message).toMatch(/radius is required/);
    });

    it("returns 400 when radius is not a number", async () => {
      await request(app)
        .post("/api/addresses/searches")
        .set("Authorization", `Bearer ${token}`)
        .send({ radius: "10", from: { lat: 48.8, lng: 2.3 } })
        .expect(400);
    });

    it("returns 400 when radius is negative", async () => {
      await request(app)
        .post("/api/addresses/searches")
        .set("Authorization", `Bearer ${token}`)
        .send({ radius: -1, from: { lat: 48.8, lng: 2.3 } })
        .expect(400);
    });

    it("returns 400 when from is missing", async () => {
      const res = await request(app)
        .post("/api/addresses/searches")
        .set("Authorization", `Bearer ${token}`)
        .send({ radius: 10 })
        .expect(400);
      expect(res.body.message).toMatch(/from object must contain lat and lng/);
    });

    it("returns 400 when from has invalid lat/lng", async () => {
      await request(app)
        .post("/api/addresses/searches")
        .set("Authorization", `Bearer ${token}`)
        .send({ radius: 10, from: { lat: "48", lng: 2.3 } })
        .expect(400);
    });

    it("returns 200 and items array with valid body", async () => {
      const res = await request(app)
        .post("/api/addresses/searches")
        .set("Authorization", `Bearer ${token}`)
        .send({ radius: 100, from: { lat: 48.8, lng: 2.3 } })
        .expect(200);
      expect(res.body.items).toBeDefined();
      expect(Array.isArray(res.body.items)).toBe(true);
    });

    it("returns addresses within radius when some exist", async () => {
      // On a créé "Paris" (48.8566, 2.3522) plus haut ; recherche proche de Paris
      const res = await request(app)
        .post("/api/addresses/searches")
        .set("Authorization", `Bearer ${token}`)
        .send({ radius: 50, from: { lat: 48.86, lng: 2.35 } })
        .expect(200);
      expect(res.body.items.length).toBeGreaterThanOrEqual(1);
      expect(res.body.items.some((a: { name: string }) => a.name === "Paris")).toBe(true);
    });
  });
});
