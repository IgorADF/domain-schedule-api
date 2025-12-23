import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { fastifyInstance } from "../../server-config.js";

describe("Seller Routes", () => {
  beforeAll(async () => {
    await fastifyInstance.ready();
  });

  afterAll(async () => {
    await fastifyInstance.close();
  });

  describe("POST /sellers", () => {
    it("should create a new seller with valid data", async () => {
      const response = await request(fastifyInstance.server)
        .post("/sellers")
        .send({
          name: "Test Seller",
          email: "test@example.com",
          password: "password123",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.email).toBe("test@example.com");
      expect(response.body.data.name).toBe("Test Seller");
      expect(response.body.data).not.toHaveProperty("password");
    });

    it("should fail when creating seller with duplicate email", async () => {
      const sellerData = {
        name: "Duplicate Seller",
        email: "duplicate@example.com",
        password: "password123",
      };

      // Create first seller
      await request(fastifyInstance.server).post("/sellers").send(sellerData);

      // Attempt to create duplicate
      const response = await request(fastifyInstance.server)
        .post("/sellers")
        .send(sellerData);

      expect(response.status).toBe(400);
    });

    it("should fail with invalid email", async () => {
      const response = await request(fastifyInstance.server)
        .post("/sellers")
        .send({
          name: "Test Seller",
          email: "invalid-email",
          password: "password123",
        });

      expect(response.status).toBe(400);
    });

    it("should fail with short password", async () => {
      const response = await request(fastifyInstance.server)
        .post("/sellers")
        .send({
          name: "Test Seller",
          email: "test2@example.com",
          password: "short",
        });

      expect(response.status).toBe(400);
    });

    it("should fail with missing required fields", async () => {
      const response = await request(fastifyInstance.server)
        .post("/sellers")
        .send({
          email: "test3@example.com",
        });

      expect(response.status).toBe(400);
    });
  });

  describe("POST /sellers/auth", () => {
    beforeAll(async () => {
      // Create a seller for authentication tests
      await request(fastifyInstance.server).post("/sellers").send({
        name: "Auth Test Seller",
        email: "auth@example.com",
        password: "password123",
      });
    });

    it("should authenticate seller with valid credentials", async () => {
      const response = await request(fastifyInstance.server)
        .post("/sellers/auth")
        .send({
          email: "auth@example.com",
          password: "password123",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id");
    });

    it("should fail with invalid password", async () => {
      const response = await request(fastifyInstance.server)
        .post("/sellers/auth")
        .send({
          email: "auth@example.com",
          password: "wrongpassword",
        });

      expect(response.status).toBe(401);
    });

    it("should fail with non-existent email", async () => {
      const response = await request(fastifyInstance.server)
        .post("/sellers/auth")
        .send({
          email: "nonexistent@example.com",
          password: "password123",
        });

      expect(response.status).toBe(401);
    });

    it("should fail with invalid email format", async () => {
      const response = await request(fastifyInstance.server)
        .post("/sellers/auth")
        .send({
          email: "invalid-email",
          password: "password123",
        });

      expect(response.status).toBe(400);
    });
  });

  describe("PATCH /sellers/:id", () => {
    let sellerId: string;

    beforeAll(async () => {
      // Create a seller for update tests
      const response = await request(fastifyInstance.server)
        .post("/sellers")
        .send({
          name: "Update Test Seller",
          email: "update@example.com",
          password: "password123",
        });
      sellerId = response.body.data.id;
    });

    it("should update seller name", async () => {
      const response = await request(fastifyInstance.server)
        .patch(`/sellers/${sellerId}`)
        .send({
          name: "Updated Name",
        });

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe("Updated Name");
      expect(response.body.data.email).toBe("update@example.com");
    });

    it("should update seller email", async () => {
      const response = await request(fastifyInstance.server)
        .patch(`/sellers/${sellerId}`)
        .send({
          email: "newemail@example.com",
        });

      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe("newemail@example.com");
    });

    it("should update both name and email", async () => {
      const response = await request(fastifyInstance.server)
        .patch(`/sellers/${sellerId}`)
        .send({
          name: "Another Name",
          email: "another@example.com",
        });

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe("Another Name");
      expect(response.body.data.email).toBe("another@example.com");
    });

    it("should fail with invalid UUID", async () => {
      const response = await request(fastifyInstance.server)
        .patch("/sellers/invalid-uuid")
        .send({
          name: "Test",
        });

      expect(response.status).toBe(400);
    });

    it("should fail with non-existent seller ID", async () => {
      const response = await request(fastifyInstance.server)
        .patch("/sellers/550e8400-e29b-41d4-a716-446655440000")
        .send({
          name: "Test",
        });

      expect(response.status).toBe(404);
    });

    it("should fail when updating to duplicate email", async () => {
      // Create another seller
      await request(fastifyInstance.server).post("/sellers").send({
        name: "Another Seller",
        email: "existing@example.com",
        password: "password123",
      });

      // Try to update with existing email
      const response = await request(fastifyInstance.server)
        .patch(`/sellers/${sellerId}`)
        .send({
          email: "existing@example.com",
        });

      expect(response.status).toBe(400);
    });

    it("should fail with invalid email format", async () => {
      const response = await request(fastifyInstance.server)
        .patch(`/sellers/${sellerId}`)
        .send({
          email: "invalid-email",
        });

      expect(response.status).toBe(400);
    });
  });
});
