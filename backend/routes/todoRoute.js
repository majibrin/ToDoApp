import express from 'express';
// We'll create the controller functions in the next step
// We are only defining the route structure here for now
// import { getTodos, createTodo, updateTodo, deleteTodo } from '../controllers/todoController.js';

const router = express.Router();

// Define the routes:
// GET /api/todos    -> Fetch all ToDos
// POST /api/todos   -> Create a new ToDo
// GET /api/todos/:id -> Fetch a single ToDo
// PATCH /api/todos/:id -> Update a ToDo (e.g., mark complete)
// DELETE /api/todos/:id -> Delete a ToDo

// router.get('/', getTodos);
// router.post('/', createTodo);
// router.patch('/:id', updateTodo);
// router.delete('/:id', deleteTodo);

export default router;