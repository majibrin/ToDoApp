// backend/server.js (Updated)

import 'dotenv/config'; 
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'; // <-- New import
import todoRoutes from './routes/todoRoutes.js'; // <-- New import

const app = express();

// --- Middleware ---
app.use(express.json()); // Parses incoming JSON data
app.use(cors()); // Allows frontend to access the API

// 3. Define port and MongoDB URI
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

// --- Routes ---
app.use('/api/todos', todoRoutes); // Use the ToDo routes

// 4. Connect to MongoDB and start the server
mongoose.connect(MONGO_URI)
  .then(() => {
    // Listen for requests ONLY after successful connection
    app.listen(PORT, () => {
      console.log(`Connected to DB and Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error);
  });

// 5. Basic route (for testing)
app.get('/', (req, res) => {
  res.send('ToDoApp Backend is Running!');
});