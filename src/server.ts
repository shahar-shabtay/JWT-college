import app from './app';
import dotenv from 'dotenv';
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import https from 'https';
import http from 'http';
import fs from 'fs';

const envFile = process.env.ENV_FILE || '.env';
dotenv.config({ path: envFile });

// Define the port
const port: string = process.env.PORT || "3000";

// Swagger setup
const swagger_options = {
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

const specs = swaggerJsDoc(swagger_options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

if(process.env.NODE_ENV !== 'production') {
  console.log('development mode');
  http.createServer(app).listen(port)
} else {
  const options = {
    key: fs.readFileSync('./client-key.pem'),
    cert: fs.readFileSync('./client-cert.pem')
  }
  https.createServer(options, app).listen(port)
}


// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});