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
    // await request(testApp).post("/auth/register").send(user);
    await request(testApp).post("/auth/register").send(user);
    const response = await request(testApp).post("/auth/login").send(user);
    accessToken = response.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Chat tests", () => {

    // Create a new post
    it("Send chat a question", async () => {
        const question = "Whats up?";
        const response = await request(testApp)
          .post("/chat")
          .set("Authorization", `JWT ${accessToken}`)
          .send({ question });
        expect(response.status).toBe(200);
    });
});