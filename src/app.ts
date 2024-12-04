import express from 'express'
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port: string = process.env.PORT || "3000";
import mongoose from 'mongoose';

// Connecting to the mongoDB
const mongoUrl: string = process.env.MONGO_URL as string;
mongoose.connect(mongoUrl); 
const db = mongoose.connection;
db.once("open", () => console.log("Connected to database"));

// Body parser
import bodyParser from 'body-parser';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


import postRoutes from './routes/posts';
app.use('/posts', postRoutes); 

import commentRoutes from './routes/comments';
app.use('/comments', commentRoutes); 

import userRoutes from './routes/users';
app.use('/users', userRoutes); 

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });