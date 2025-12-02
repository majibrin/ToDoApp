import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoForm from './TodoForm'; 

// Import icons from React Icons (Material Design set)
import { MdDelete, MdCheckCircle, MdOutlineRadioButtonUnchecked } from 'react-icons/md';

// Define the base URL for your backend API
const API_URL = 'http://localhost:5000/api/todos';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- 1. READ (Fetch all ToDos) ---
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await axios.get(API_URL);
                setTodos(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch to-dos. Is the backend server running on port 5000?');
                setLoading(false);
            }
        };
        fetchTodos();
    }, []); 

    // --- 2. CREATE (Handle new ToDo from TodoForm) ---
    const handleNewTodo = (newTodo) => {
        // Add the new task to the top of the list
        setTodos((prevTodos) => [newTodo, ...prevTodos]);
    };

    // --- 3. DELETE (Remove a ToDo) ---
    const handleDelete = async (id) => {
        try {
            // Send DELETE request to the backend
            await axios.delete(`${API_URL}/${id}`);
            
            // Update state by filtering out the deleted item
            setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
        } catch (err) {
            console.error('Failed to delete todo:', err);
        }
    };

    // --- 4. UPDATE (Toggle Complete Status) ---
    const handleUpdate = async (todoId, currentCompletionStatus) => {
        const newStatus = !currentCompletionStatus;
        
        try {
            // Send PATCH request with the toggled status
            const response = await axios.patch(`${API_URL}/${todoId}`, { 
                completed: newStatus 
            });
            
            // Update state by replacing the old task with the updated one from the server
            setTodos(prevTodos => 
                prevTodos.map(todo => 
                    todo._id === todoId ? response.data : todo
                )
            );
        } catch (err) {
            console.error('Failed to update todo:', err);
        }
    };

    // --- Conditional Rendering for State ---
    if (loading) return <div>Loading tasks...</div>;
    if (error) return <div style={{ color: 'red', padding: '20px' }}>Error: {error}</div>;

    return (
        <div className="todo-container">
            <h1>MERN Stack ToDo List</h1>
            
            <TodoForm onNewTodo={handleNewTodo} /> 
            
            <hr/>
            
            <div className="todos-list">
                <h2>Your Tasks ({todos.length})</h2>
                {todos.length === 0 ? (
                    <p>No tasks yet. Use the form above to add one!</p>
                ) : (
                    <ul>
                        {todos.map((todo) => (
                            <li key={todo._id}>
                                {/* Apply strike-through style if completed */}
                                <span 
                                    style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                                >
                                    {todo.title}
                                </span>
                                
                                {/* 1. Delete Button */}
                                <button onClick={() => handleDelete(todo._id)}>
                                    <MdDelete size={20} /> 
                                </button>
                                
                                {/* 2. Update Button (Toggle Complete/Incomplete Icons) */}
                                <button 
                                    onClick={() => handleUpdate(todo._id, todo.completed)}
                                >
                                    {todo.completed 
                                        ? <MdOutlineRadioButtonUnchecked size={20} /> 
                                        : <MdCheckCircle size={20} />
                                    } 
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default TodoList;