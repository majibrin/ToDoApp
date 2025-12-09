import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/todos';

const TodoForm = ({ onNewTodo, user, getAuthHeaders }) => { 
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    // 💡 NEW STATE for time/alert fields
    const [dueDate, setDueDate] = useState('');
    const [alertPreference, setAlertPreference] = useState('none'); 
    
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        if (!user) {
            setError('You must be logged in to add tasks.');
            return;
        }

        if (!title.trim()) {
            setError("Title cannot be empty.");
            return;
        }

        setIsSaving(true);
        setError(null);
        
        // 💡 UPDATED PAYLOAD: Include new fields
        const newTodo = { 
            title: title.trim(), 
            description: description.trim(),
            dueDate: dueDate || null, // Send null if field is empty
            alertPreference: alertPreference
        };

        try {
            // POST request with authentication headers
            const response = await axios.post(API_URL, newTodo, getAuthHeaders()); 
            
            onNewTodo(response.data); 
            // 💡 RESET ALL FIELDS on success
            setTitle('');
            setDescription('');
            setDueDate('');
            setAlertPreference('none'); 
            
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create ToDo.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="todo-form">
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
            
            {/* 💡 NEW: Due Date/Time Input */}
            <label style={{ marginTop: '10px', display: 'block' }}>Due Date & Time (Optional):</label>
            <input
                type="datetime-local" // HTML input for date and time combined
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isSaving}
            />

            {/* 💡 NEW: Alert/Reminder Selector */}
            <label style={{ marginTop: '10px', display: 'block' }}>Set Reminder:</label>
            <select
                value={alertPreference}
                onChange={(e) => setAlertPreference(e.target.value)}
                disabled={isSaving}
            >
                <option value="none">No Reminder</option>
                <option value="at_due">At Due Time</option>
                <option value="5min_before">5 Minutes Before</option>
                <option value="1hr_before">1 Hour Before</option>
            </select>
            
            <button type="submit" disabled={isSaving || !title.trim()}>
                {isSaving ? 'Adding...' : 'Add ToDo'}
            </button>
        </form>
    );
};

export default TodoForm;