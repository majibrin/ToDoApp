import express from 'express';
// --- 1. Import Controller Functions ---
import { 
    getTodos, 
    getTodo,
    createTodo, 
    updateTodo, 
    deleteTodo 
} from '../controllers/todoController.js'; 

const router = express.Router();

// Define the routes:

// GET /api/todos    -> Fetch all ToDos
router.get('/', getTodos);

// GET /api/todos/:id -> Fetch a single ToDo
router.get('/:id', getTodo);

// POST /api/todos   -> Create a new ToDo
router.post('/', createTodo);

// PATCH /api/todos/:id -> Update a ToDo (e.g., mark complete)
router.patch('/:id', updateTodo);

// DELETE /api/todos/:id -> Delete a ToDo
router.delete('/:id', deleteTodo);

export default router;