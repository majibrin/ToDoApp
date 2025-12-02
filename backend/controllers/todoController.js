import Todo from '../models/todoModel.js';
import mongoose from 'mongoose';

// --- 1. GET all ToDos (READ - Plural) ---
const getTodos = async (req, res) => {
    // Finds all documents, sorted by newest first (createdAt: -1)
    const todos = await Todo.find({}).sort({ createdAt: -1 });
    res.status(200).json(todos);
};

// --- 2. GET a single ToDo (READ - Singular) ---
const getTodo = async (req, res) => {
    const { id } = req.params; // Get the ID from the URL

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid ToDo ID format' });
    }

    // Find the single document by its ID
    const todo = await Todo.findById(id);

    if (!todo) {
        return res.status(404).json({ error: 'ToDo not found' });
    }

    res.status(200).json(todo);
};

// --- 3. POST a new ToDo (CREATE) ---
const createTodo = async (req, res) => {
    const { title, description } = req.body; 

    // Simple validation
    if (!title) {
        return res.status(400).json({ error: 'A title is required for the ToDo.' });
    }

    try {
        // Create a new document in the database
        const todo = await Todo.create({ title, description });
        res.status(201).json(todo); // 201 status code means "Created"
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// --- 4. PATCH/PUT a ToDo (UPDATE) ---
const updateTodo = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid ToDo ID' });
    }

    // Find by ID and update the fields provided in req.body. { new: true } returns the updated document.
    const todo = await Todo.findByIdAndUpdate(
        { _id: id },
        { ...req.body },
        { new: true } 
    );

    if (!todo) {
        return res.status(404).json({ error: 'ToDo not found' });
    }
    res.status(200).json(todo);
};

// --- 5. DELETE a ToDo (DELETE) ---
const deleteTodo = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid ToDo ID' });
    }

    // Find by ID and delete the document
    const todo = await Todo.findByIdAndDelete({ _id: id });

    if (!todo) {
        return res.status(404).json({ error: 'ToDo not found' });
    }
    res.status(200).json({ message: 'ToDo successfully deleted', deletedTodo: todo });
};


// --- FINAL EXPORT ---
// This ensures that all functions, including 'getTodo', are available for import in todoRoutes.js
export {
    getTodos,
    getTodo, // <-- The previously missing function
    createTodo,
    updateTodo,
    deleteTodo
};