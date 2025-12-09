// backend/controllers/todoController.js (FINAL ES MODULE VERSION)

import Todo from '../models/todoModel.js'; // <-- FIX: Added .js
import mongoose from "mongoose";

// ===================================
// GET all todos for a specific user
// ===================================
const getTodos = async (req, res) => {
    // The requireAuth middleware attached the user's ID to the request object.
    const user_id = req.user_id; 

    // Find ONLY the documents (todos) that match that user_id.
    const todos = await Todo.find({ user_id }).sort({ createdAt: -1 });

    res.status(200).json(todos);
};

// ===================================
// GET a single todo
// ===================================
const getTodo = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such todo' });
    }

    const user_id = req.user_id;

    // Find by ID and ensure it belongs to the authenticated user
    const todo = await Todo.findOne({ _id: id, user_id }); 

    if (!todo) {
        return res.status(404).json({ error: 'No such todo found for this user' });
    }

    res.status(200).json(todo);
};

// ===================================
// POST a new todo
// ===================================
const createTodo = async (req, res) => {
    const { title, description } = req.body;

    // Basic validation
    if (!title) {
        return res.status(400).json({ error: 'Please enter a title for the task.' });
    }
    
    // The requireAuth middleware attached the user's ID to the request object.
    const user_id = req.user_id; 

    try {
        // Create the new Todo and critically INCLUDE the user_id
        const todo = await Todo.create({ title, description, user_id }); 
        res.status(200).json(todo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ===================================
// DELETE a todo
// ===================================
const deleteTodo = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such todo' });
    }

    const user_id = req.user_id;

    // Find by ID and ensure it belongs to the user before deleting
    const todo = await Todo.findOneAndDelete({ _id: id, user_id });

    if (!todo) {
        return res.status(404).json({ error: 'No such todo found for this user' });
    }

    res.status(200).json(todo);
};

// ===================================
// UPDATE a todo (Patch/Toggle Complete)
// ===================================
const updateTodo = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such todo' });
    }

    const user_id = req.user_id;
    
    // Find by ID and ensure it belongs to the user before updating
    const todo = await Todo.findOneAndUpdate(
        { _id: id, user_id }, 
        { ...req.body }, 
        { new: true }
    );

    if (!todo) {
        return res.status(404).json({ error: 'No such todo found for this user' });
    }

    res.status(200).json(todo);
};


// FIX: Changed 'exports =' to 'export default' or 'export const'
// Since you want to export multiple named functions, use this:
export {
    getTodos,
    getTodo,
    createTodo,
    deleteTodo,
    updateTodo
};