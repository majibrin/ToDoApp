import 'dotenv/config'; // Loads .env file variables into process.env
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import todoRoutes from './routes/todoRoutes.js'; 
import userRoutes from './routes/userRoutes.js'; 

// --- 1. Configuration Variables ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI; // Retrieved from backend/.env

// --- 2. Initialize the Express App ---
const app = express();

// --- 3. Middleware ---
// Allows the server to parse incoming JSON data from the request body
app.use(express.json()); 

// Enables Cross-Origin Resource Sharing (CORS) 
// This is essential so your frontend (e.g., localhost:5173) can talk to your backend (localhost:5000)
app.use(cors()); 

// --- 4. Routes ---
// Use the ToDo routes for any requests starting with /api/todos
app.use('/api/todos', todoRoutes); 
// --- NEW: Use the User routes for authentication ---
app.use('/api/user', userRoutes);

// --- NEW: Simple Root Route for Server Health Check ---
app.get('/', (req, res) => {
  res.status(200).json({ message: 'ToDoApp API is running successfully! Access routes at /api/todos' });
});


// --- 5. Database Connection and Server Start ---
const connectDB = async () => {
    try {
        // Attempt to connect to the database
        await mongoose.connect(MONGO_URI);
        
        // Success: Start the Express server ONLY after successful DB connection
        app.listen(PORT, () => {
            console.log(`🎉 DB Connected & Server running on port ${PORT}`);
        });

    } catch (error) {
        // Failure: Log the error and exit the application
        console.error("❌ MongoDB connection failed:", error.message);
        // Exits the process with a failure code
        process.exit(1); 
    }
};

// Execute the connection and server start function
connectDB();