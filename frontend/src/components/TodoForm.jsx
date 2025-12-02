import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/todos';

const TodoForm = ({ onNewTodo }) => {
    // State to manage the input values
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // --- Function to handle form submission ---
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default page reload

        if (!title.trim()) {
            setError("Title cannot be empty.");
            return;
        }

        setIsSaving(true);
        setError(null);

        const newTodo = { title: title.trim(), description: description.trim() };

        try {
            // Send POST request to the backend API
            const response = await axios.post(API_URL, newTodo);
            
            // Call the function passed from the parent (TodoList) to update the list
            onNewTodo(response.data); 

            // Clear the form
            setTitle('');
            setDescription('');
        } catch (err) {
            // Handle errors from the API (e.g., validation)
            setError(err.response?.data?.error || 'Failed to create ToDo.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Add New Task</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <input
                type="text"
                placeholder="Task Title (Required)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSaving}
            />
            
            <input
                type="text"
                placeholder="Description (Optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSaving}
            />
            
            <button type="submit" disabled={isSaving || !title.trim()}>
                {isSaving ? 'Adding...' : 'Add ToDo'}
            </button>
        </form>
    );
};

export default TodoForm;