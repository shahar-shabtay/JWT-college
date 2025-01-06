import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

const envFile = process.env.ENV_FILE || '.env';
console.log(`Using environment file: ${envFile}`);
dotenv.config({ path: envFile });

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

// Allow CORS from our client
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true,
  })
);

// Routes
import postRoutes from './routes/posts';
app.use('/posts', postRoutes);

import commentRoutes from './routes/comments';
app.use('/comments', commentRoutes);

import userRoutes from './routes/users';
app.use('/users', userRoutes);

import chatRoutes from './routes/chat';
app.use('/chat', chatRoutes);

import authRoutes from './routes/auth'
app.use(express.json());
app.use('/auth', authRoutes);

export default app;