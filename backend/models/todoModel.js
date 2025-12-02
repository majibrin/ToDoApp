import mongoose from 'mongoose';

// Define the structure of a single ToDo item
const todoSchema = new mongoose.Schema({
    // 1. The main content of the ToDo
    title: {
        type: String,
        required: [true, 'Please add a title'], // Make sure it exists
        trim: true, // Remove leading/trailing whitespace
        maxLength: 100 // Set a reasonable maximum length
    },
    // 2. Optional details
    description: {
        type: String,
        required: false, // Description is optional
        trim: true,
        maxLength: 500
    },
    // 3. Status
    completed: {
        type: Boolean,
        default: false // New tasks start as incomplete
    }
}, {
    // Automatically adds 'createdAt' and 'updatedAt' fields
    timestamps: true
});

// Create and export the Model based on the Schema
const Todo = mongoose.model('Todo', todoSchema);
export default Todo;