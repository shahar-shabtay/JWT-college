import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';

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
    origin: [
      'http://localhost:5173',  // For local development
      'https://node71.cs.colman.ac.il',  // For production
      'https://193.106.55.231',
    ],
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

import likeRoute from './routes/likes'
app.use('/likes', likeRoute);

import fileRoute from './routes/file';
app.use('/file', fileRoute);
app.use("/public", express.static('public'));

// Serve front
const frontPath = path.join(__dirname, "front");
app.use(express.static(frontPath));

// Fallback to client routing
app.get("*", (req,res) => {
  res.sendFile(path.join(frontPath, "index.html"));
});

export default app;