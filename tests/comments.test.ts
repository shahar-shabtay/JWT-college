import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import Comment from "../src/models/comments";
import { Express } from "express";

let testApp: Express;

beforeAll(async () => {

    // Close old connections 
    await mongoose.connection.close();
    if (mongoose.connection.readyState === 0) {
        const dbUri = process.env.TEST_MONGO_URL || "";
        console.log(`Connecting to MongoDB at ${dbUri}`);

        // Connect to MongoDB
        await mongoose.connect(process.env.TEST_MONGO_URL || "");
        await Comment.deleteMany();
        console.log('MongoDB connection established');
    }    

    testApp = app;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Comments tests", () => {
    let testCommentId: string;

    // Create a new comment
    it("create a new comment", async () => {
        const newComment = {
            commenter: "Yuval",
            postID: "673b7041241ed1b7a603a64b",
            content: "This is the best post ever!"
        };

        const response = await request(testApp).post("/comments").send(newComment);

        expect(response.status).toBe(201); // Created
        expect(response.body).toHaveProperty("_id");
        expect(response.body.commenter).toBe("Yuval");
        expect(response.body.postID).toBe("673b7041241ed1b7a603a64b");
        expect(response.body.content).toBe("This is the best post ever!");

        // Save the comment ID for later use
        testCommentId = response.body._id;
    });

    // Get all comments
    it("get all comments", async () => {
        const response = await request(testApp).get("/comments");

        expect(response.status).toBe(200); // OK
        expect(Array.isArray(response.body)).toBe(true);
    });

    // Get comment by ID
    it("get a comment by ID", async () => {
        const response = await request(testApp).get(`/comments/${testCommentId}`);

        expect(response.status).toBe(200); // OK
        expect(response.body).toHaveProperty("_id", testCommentId);
        expect(response.body.commenter).toBe("Yuval");
        expect(response.body.postID).toBe("673b7041241ed1b7a603a64b");
        expect(response.body.content).toBe("This is the best post ever!");
    });

        // Get comment by post ID
        it("get a comment by postID", async () => {
            const postID = "673b7041241ed1b7a603a64b";
            const response = await request(testApp).get(`/comments/comment/${postID}`);
            expect(response.status).toBe(200); // OK
        });

    // Update comment data
    it("update comment data", async () => {
        const updatedData = {
            postID: "12345"
        };

        const response = await request(testApp).put(`/comments/${testCommentId}`).send(updatedData);

        expect(response.status).toBe(200); // OK
        expect(response.body).toHaveProperty("_id", testCommentId);
        expect(response.body.postID).toBe("12345");
    });

    // Delete a comment by ID
    it("delete a comment by ID", async () => {
        const response = await request(testApp).delete(`/comments/${testCommentId}`);

        expect(response.status).toBe(200); // OK
        expect(response.body).toHaveProperty("message", "Object deleted successfully");

        // Confirm comment deletion
        const getCommentResponse = await request(testApp).get(`/comments/${testCommentId}`);
        expect(getCommentResponse.status).toBe(404); // Not found
    });
});
