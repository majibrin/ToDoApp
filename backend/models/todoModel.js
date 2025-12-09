// backend/models/todoModel.js (FINAL CORRECTED VERSION)

import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
    // 1. The main content of the ToDo
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxLength: 100
    },
    // 2. Optional details
    description: {
        type: String,
        required: false,
        trim: true,
        maxLength: 500
    },
    // 3. Status
    completed: {
        type: Boolean,
        default: false
    },
    // ----------------------------------------------------------------
    // 4. CRITICAL FIX: Add the user_id reference for authentication
    user_id: {
        type: mongoose.Schema.Types.ObjectId, // Defines the field as a MongoDB object ID
        required: true, // The task MUST be linked to a user
        ref: 'User' // Explicitly link this ID to the 'User' model (for population/reference)
    },
    // NEW FIELDS:
    dueDate: {
        type: Date, // Use Date type to store both date and time
        required: false
    },
    alertPreference: {
        type: String, // e.g., '5min_before', '1hr_before', or 'none'
        required: false,
        default: 'none'
    }
}, {
    timestamps: true
});

// Create and export the Model based on the Schema
const Todo = mongoose.model('Todo', todoSchema);
export default Todo;