import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import Post from "../src/models/posts";
import { Express } from "express";

let testApp: Express;

beforeAll(async () => {
    testApp = app;

    // Connect to MongoDB
    await mongoose.connect(process.env.TEST_MONGO_URL || "");
    await Post.deleteMany();

});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Posts tests", () => {
    let testPostId: string;

    // Create a new post
    it("create a new post", async () => {
        const newPost = {
            title: "My First Post",
            content: "This is the content of my first post.",
            sender: "64fe4c2ae7891b6cf7890def"
        };

        const response = await request(testApp).post("/posts").send(newPost);

        expect(response.status).toBe(201); // Created
        expect(response.body).toHaveProperty("_id");
        expect(response.body.title).toBe("My First Post");
        expect(response.body.content).toBe("This is the content of my first post.");
        expect(response.body.sender).toBe("64fe4c2ae7891b6cf7890def");

        // Save the post ID for later use
        testPostId = response.body._id;
    });

    // Get all posts
    it("get all posts", async () => {
        const response = await request(testApp).get("/posts");

        expect(response.status).toBe(200); // OK
        expect(Array.isArray(response.body)).toBe(true);
    });

    // Get post by sender
    it("get a post by sender", async () => {
        const response = await request(testApp).get("/posts?sender=64fe4c2ae7891b6cf7890def");

        expect(response.status).toBe(200); // OK
        expect(Array.isArray(response.body)).toBe(true);
    });

    // Get post by ID
    it("get a post by ID", async () => {
        const response = await request(testApp).get(`/posts/${testPostId}`);

        expect(response.status).toBe(200); // OK
        expect(response.body).toHaveProperty("_id", testPostId);
        expect(response.body.title).toBe("My First Post");
        expect(response.body.content).toBe("This is the content of my first post.");
        expect(response.body.sender).toBe("64fe4c2ae7891b6cf7890def");
    });

    // Update post data
    it("update post data", async () => {
        const updatedData = {
            title: "My LASTTTTTTTTT Post"
        };

        const response = await request(testApp).put(`/posts/${testPostId}`).send(updatedData);

        expect(response.status).toBe(200); // OK
        expect(response.body).toHaveProperty("_id", testPostId);
        expect(response.body.title).toBe("My LASTTTTTTTTT Post");
    });

    // Delete a post by ID
    it("delete a post by ID", async () => {
        const response = await request(testApp).delete(`/posts/${testPostId}`);

        expect(response.status).toBe(200); // OK
        expect(response.body).toHaveProperty("message", "Object deleted successfully");

        // Confirm post deletion
        const getPostResponse = await request(testApp).get(`/posts/${testPostId}`);
        expect(getPostResponse.status).toBe(404); // Not found
    });
});
