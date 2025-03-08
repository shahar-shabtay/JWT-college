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
        // await Post.deleteMany();
        // await User.deleteMany();
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


describe("File Tests", () => {
    test("upload file", async () => {
      const filePath = `${__dirname}/test_file.txt`;
   
      try {
        const response = await request(app)
          .post("/file?test_file.txt").attach('file', filePath)
        expect(response.statusCode).toEqual(200);
        let url = response.body.url;
        console.log("url: " + url);
        url = url.replace(/^.*\/\/[^/]+/, '')
        console.log("url: " + url);
        const res = await request(app).get(url)
        expect(res.statusCode).toEqual(200);
      } catch (err) {
        console.log(err);
        expect(1).toEqual(2);
        
      }
    })
});