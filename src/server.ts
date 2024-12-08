import app from './app';
import dotenv from 'dotenv';

const envFile = process.env.ENV_FILE || '.env';
dotenv.config({ path: envFile });

// Define the port
const port: string = process.env.PORT || "3000";

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});