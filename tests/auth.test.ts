import mongoose from 'mongoose';
import request from 'supertest';
import app from "../src/app";
import { Express } from "express";

let testApp: Express;
let registeredUser: any; // Using 'any' instead of defining a strict type

beforeAll(async () => {
  testApp = app;

  // Connect to the test database only if not already connected
  if (mongoose.connection.readyState === 0) {
    const dbUri = process.env.TEST_MONGO_URL || "";
    console.log(`Connecting to MongoDB at ${dbUri}`);
    await mongoose.connect(dbUri);
    console.log('MongoDB connection established');
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
});

afterAll(async () => {
  // Close the database connection after all tests
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
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

  it('should fail to register with weak password', async () => {
    const res = await request(testApp).post('/auth/register').send({
      email: `weakpassword-${Date.now()}@example.com`,  // Use a unique email
      password: '123',  // Weak password
      username: 'weakuser',
    });

    // Assert the expected behavior for weak passwords
    if (res.body.error) {
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Password is too weak');
    } else {
      console.error('Weak password test failed.');
    }
  });
});
