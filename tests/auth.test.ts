import mongoose from 'mongoose';
import request from 'supertest';
import app from "../src/app";
import { Express } from "express";
// import { access } from 'fs';

let testApp: Express;

interface User {
  email: string;
  username: string;
}

let registeredUser: User; // Define a strict type for registeredUser
let accessToken: string;

beforeAll(async () => {
  testApp = app;

  // Close old connections 
  await mongoose.connection.close();
  if (mongoose.connection.readyState === 0) {
    const dbUri = process.env.TEST_MONGO_URL || "";
    await mongoose.connect(dbUri);
  }

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
  // Close the database connection after all tests
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
});


describe('Auth API Tests', () => {
  it('should register a new user', async () => {

    // Check that the user details match the registered user
    if (registeredUser && registeredUser.email) {
      expect(registeredUser).toHaveProperty('email');
      expect(registeredUser).toHaveProperty('username');
      expect(registeredUser.email).toMatch(/@example.com$/); // Make sure the email matches the format
      expect(registeredUser.username).toBe('test2user');
    } else {
      console.error('User registration failed.');
    }
  });
  
  test("Test forbidden access without token", async () => {
    const res = await request(testApp).get("/users");
    expect(res.status).toBe(401);
  });
  
  test("Test access with token", async () => {
    const res = await request(testApp).get("/users").set("Authorization", `JWT ${accessToken}`);
    expect(res.status).toBe(200);
  });

  test("Test Logout", async () => {
    const res = await request(testApp).post("/auth/logout").set("Authorization", `JWT ${accessToken}`);
    expect(res.status).toBe(200);
  });

});
