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

// Body parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const postRoutes = require('./routes/posts');
app.use('/posts', postRoutes); 

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });