import app from './app';
import dotenv from 'dotenv';
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import express from 'express';
import authRoutes from './routes/auth'

dotenv.config();

// Define the port
const port: string = process.env.PORT || "3000";

// Swagger setup
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Shahar&Yuval web dev (:",
      version: "1.0.0",
      description: "REST server including authentication using JWT and Refresh token",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./src/routes/*.ts"], 
};

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
