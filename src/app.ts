import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

dotenv.config();

// Create the Express app
const app = express();

// MongoDB connection
const mongoUrl: string = process.env.MONGO_URL as string;
mongoose.connect(mongoUrl);
const db = mongoose.connection;
db.once("open", () => console.log("Connected to database"));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
import postRoutes from './routes/posts';
app.use('/posts', postRoutes);

import commentRoutes from './routes/comments';
app.use('/comments', commentRoutes);

import userRoutes from './routes/users';
app.use('/users', userRoutes);

// Login  
import authRoutes from './routes/auth'
app.use(express.json()); // For parsing JSON
app.use('/auth', authRoutes); // Register the auth routes

export default app;