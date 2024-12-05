import app from './app';
import dotenv from 'dotenv';

dotenv.config();

// Define the port
const port: string = process.env.PORT || "3000";

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});