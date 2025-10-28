import express from 'express';
import connectDB from './config/connect.js';
import router from './routers/router.js';

import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api', router);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
});
