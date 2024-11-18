const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT;
const mongoose = require("mongoose");
const { route } = require("./routes/posts");



// Connecting to the mongoDB
mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
const db = mongoose.connection;
db.once("open", () => console.log("Connected to database"));

const postRoutes = require('./routes/posts');
app.use('/posts', postRoutes); 