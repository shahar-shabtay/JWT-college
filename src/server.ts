import app from './app';
import dotenv from 'dotenv';
import https from 'https';
import http from 'http';
import fs from 'fs';

const envFile = process.env.ENV_FILE || '.env';
dotenv.config({ path: envFile });

// Define the port
const port: string = process.env.PORT || "3000";

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