import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import User from "../src/models/users";
import { Express } from "express";

let testApp: Express;

interface User {
    email: string;
    username: string;
  }
  
let registeredUser: User; // Define a strict type for registeredUser
let accessToken: string;

beforeAll(async () => {
    
    // Close old connections 
    await mongoose.connection.close();
    if (mongoose.connection.readyState === 0) {
        
        // Connect to MongoDB
        await mongoose.connect(process.env.TEST_MONGO_URL || "");
        console.log('MongoDB connection established');
        await User.deleteMany();
    }    

    testApp = app;

    // Register a new user before the tests
    const uniqueEmail = `test-${Date.now()}@example.com`;  // Generate unique email using timestamp
    const res = await request(testApp).post('/auth/register').send({
    email: uniqueEmail,
    password: 'test123',
    username: 'test2user',
    });

    // Check for errors and handle registration
    if (res.body.error) {
        console.log(`Error during registration: ${res.body.error}`);
    } else {
        registeredUser = res.body.user || {}; // Ensure registeredUser is assigned correctly
        console.log(`User registered with Email: ${registeredUser.email}`);
    }

    const response = await request(testApp).post("/auth/login").send({
        email: registeredUser.email,
        password: "test123"
    });
      expect(response.status).toBe(200);
      accessToken = response.body.accessToken; // Set the shared accessToken
      expect(accessToken).toBeDefined();  
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Users tests", () => {
    let testUserId: string;

    // Create a new user
    it("create a new user", async () => {
        const newUser = {
            email: "yuval@example.com",
            username: "yuval123",
            password: "123456"
        };

        const response = await request(testApp).post("/users").send(newUser).set("Authorization", `JWT ${accessToken}`);

        expect(response.status).toBe(201); // Created
        expect(response.body).toHaveProperty("_id");
        expect(response.body.username).toBe("yuval123");
        expect(response.body.email).toBe("yuval@example.com");

        // Save the user ID for later use
        testUserId = response.body._id;
    });

    // Get all users
    it("get all users", async () => {
        const response = await request(testApp).get("/users").set("Authorization", `JWT ${accessToken}`);

        expect(response.status).toBe(200); // OK
        expect(Array.isArray(response.body)).toBe(true);
    });

    // Get user by ID
    it("get a user by ID", async () => {
        const response = await request(testApp).get(`/users/${testUserId}`).set("Authorization", `JWT ${accessToken}`);

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

        const response = await request(testApp).put(`/users/${testUserId}`).send(updatedData).set("Authorization", `JWT ${accessToken}`);

        expect(response.status).toBe(200); // OK
        expect(response.body).toHaveProperty("_id", testUserId);
        expect(response.body.email).toBe("2@example.com");
    });

    // Delete a user by ID
    it("delete a user by ID", async () => {
        const response = await request(testApp).delete(`/users/${testUserId}`).set("Authorization", `JWT ${accessToken}`);

        expect(response.status).toBe(200); // OK
        expect(response.body).toHaveProperty("message", "Object deleted successfully");

        // Confirm user deletion
        const getUserResponse = await request(testApp).get(`/users/${testUserId}`).set("Authorization", `JWT ${accessToken}`);
        expect(getUserResponse.status).toBe(404); // Not found
    });
});
