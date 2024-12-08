import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import User from "../src/models/users";
import { Express } from "express";

let testApp: Express;

beforeAll(async () => {
    testApp = app;

    // Connect to MongoDB
    await mongoose.connect(process.env.TEST_MONGO_URL || "");
    await User.deleteMany();

});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Users tests", () => {
    let testUserId: string;

    // Create a new user
    it("create a new user", async () => {
        const newUser = {
            username: "yuval123",
            email: "yuval@example.com",
            password: "123456"
        };

        const response = await request(testApp).post("/users").send(newUser);

        expect(response.status).toBe(201); // Created
        expect(response.body).toHaveProperty("_id");
        expect(response.body.username).toBe("yuval123");
        expect(response.body.email).toBe("yuval@example.com");

        // Save the user ID for later use
        testUserId = response.body._id;
    });

    // Get all users
    it("get all users", async () => {
        const response = await request(testApp).get("/users");

        expect(response.status).toBe(200); // OK
        expect(Array.isArray(response.body)).toBe(true);
    });

    // Get user by ID
    it("get a user by ID", async () => {
        const response = await request(testApp).get(`/users/${testUserId}`);

        expect(response.status).toBe(200); // OK
        expect(response.body).toHaveProperty("_id", testUserId);
        expect(response.body.username).toBe("yuval123");
        expect(response.body.email).toBe("yuval@example.com");
    });

    // Update user data
    it("update user data", async () => {
        const updatedData = {
            email: "2@example.com"
        };

        const response = await request(testApp).put(`/users/${testUserId}`).send(updatedData);

        expect(response.status).toBe(200); // OK
        expect(response.body).toHaveProperty("_id", testUserId);
        expect(response.body.email).toBe("2@example.com");
    });

    // Delete a user by ID
    it("delete a user by ID", async () => {
        const response = await request(testApp).delete(`/users/${testUserId}`);

        expect(response.status).toBe(200); // OK
        expect(response.body).toHaveProperty("message", "Object deleted successfully");

        // Confirm user deletion
        const getUserResponse = await request(testApp).get(`/users/${testUserId}`);
        expect(getUserResponse.status).toBe(404); // Not found
    });
});
