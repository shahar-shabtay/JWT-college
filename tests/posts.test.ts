import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import Post from "../src/models/posts";
import { Express } from "express";
import User, { IUser } from "../src/models/users";
// import exp from "constants";

const user: IUser = {
    email: "newuser@example.com",
    username: "newuser123",
    password: "securepassword"
}

let testApp: Express;
let accessToken: string;
let userId: string;

beforeAll(async () => {
    
    // Close old connections 
    await mongoose.connection.close();
    if (mongoose.connection.readyState === 0) {

        // Connect to MongoDB
        await mongoose.connect(process.env.TEST_MONGO_URL || "");
        await Post.deleteMany();
        await User.deleteMany();
    }

    testApp = app;
    
    // Get a token
    const register_response = await request(testApp).post("/auth/register").send(user);
    console.log(register_response.body);
    userId = register_response.body._id;
    const response = await request(testApp).post("/auth/login").send(user);
    accessToken = response.body.accessToken;
    console.log(accessToken);
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
            owner: "64fe4c2ae7891b6cf7890def"
        };

        const response = (await request(testApp).post("/posts").set("Authorization", `JWT ${accessToken}`).send(newPost));

        expect(response.status).toBe(201); // Created
        expect(response.body).toHaveProperty("_id");
        expect(response.body.title).toBe("My First Post");
        expect(response.body.content).toBe("This is the content of my first post.");

        // expect(response.body.owner).toEqual(userId);

        // Save the post ID for later use
        testPostId = response.body._id;
    });

    // Get all posts
    it("get all posts", async () => {
        const response = await request(testApp).get("/posts");

        expect(response.status).toBe(200); // OK
        expect(Array.isArray(response.body)).toBe(true);
    });

    // Get post by owner
    it("get a post by owner", async () => {
        const response = await request(testApp).get("/posts?owner=64fe4c2ae7891b6cf7890def");

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
        expect(response.body.owner).toBe("64fe4c2ae7891b6cf7890def");
    });

    // Update post data
    it("update post data", async () => {
        const updatedData = {
            title: "My LASTTTTTTTTT Post"
        };

        const response = await request(testApp).put(`/posts/${testPostId}`).set("Authorization", `JWT ${accessToken}`).send(updatedData);

        expect(response.status).toBe(200); // OK
        expect(response.body).toHaveProperty("_id", testPostId);
        expect(response.body.title).toBe("My LASTTTTTTTTT Post");
    });

    // Delete a post by ID
    it("delete a post by ID", async () => {
        const response = await request(testApp).delete(`/posts/${testPostId}`).set("Authorization", `JWT ${accessToken}`);

        expect(response.status).toBe(200); // OK
        expect(response.body).toHaveProperty("message", "Object deleted successfully");

        // Confirm post deletion
        const getPostResponse = await request(testApp).get(`/posts/${testPostId}`);
        expect(getPostResponse.status).toBe(404); // Not found
    });
});