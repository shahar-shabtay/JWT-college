import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import { Express } from "express";

let testApp: Express;

beforeAll(async () => {
    testApp = app;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("File upload tests", () => {

    test("upload file", async () => {
        const filePath = `${__dirname}/wusha.jpg`;
        console.log(filePath);
        try {
          const response = await request(testApp)
            .post("/file?file=wusha.jpg").attach('file', filePath)
          expect(response.statusCode).toEqual(200);
          let url = response.body.url;
          console.log(url);
          url = url.replace(/^.*\/\/[^/]+/, '');
          console.log(url);
          const res = await request(testApp).get(url)
          expect(res.statusCode).toEqual(200);
        } catch (err) {
          console.log(err);
          expect(1).toEqual(2);
        }
      });
});
