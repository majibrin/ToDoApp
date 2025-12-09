import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoForm from './TodoForm'; 
import { useAuthContext } from '../hooks/useAuthContext'; 
import { MdDelete, MdCheckCircle, MdOutlineRadioButtonUnchecked } from 'react-icons/md';

const API_URL = 'http://localhost:5000/api/todos';

// 💡 NEW HELPER FUNCTION: To format the date/time display
const formatDueDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    // Format for local display (e.g., 25 Oct 2025, 9:30 AM)
    return new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric' 
    }).format(date);
};

const TodoList = () => {
    const { user } = useAuthContext();
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // 💡 NEW STATE: Tracks the _id of the currently active/expanded task
    const [activeTodoId, setActiveTodoId] = useState(null); 

    // 💡 NEW FUNCTION: Toggles the description visibility
    const toggleDescription = (id) => {
        setActiveTodoId(activeTodoId === id ? null : id);
    };

    const getAuthHeaders = () => {
        if (!user) return {}; 
        return {
            headers: { 'Authorization': `Bearer ${user.token}` }
        };
    };

    // --- READ (Fetch all ToDos) ---
    useEffect(() => {
        const fetchTodos = async () => {
            if (!user) {
                setTodos([]); 
                setLoading(false);
                return; 
            }

            try {
                const response = await axios.get(API_URL, getAuthHeaders());
                setTodos(response.data);
                setLoading(false);
                setError(null);
            } catch (err) {
                setError('Failed to fetch tasks. Your session may have expired.');
                setLoading(false);
            }
        };

        fetchTodos();
    }, [user]);

    // --- CREATE (Handle new ToDo from TodoForm) ---
    const handleNewTodo = (newTodo) => {
        setTodos((prevTodos) => [newTodo, ...prevTodos]);
    };

    // --- DELETE (Remove a ToDo) ---
    const handleDelete = async (id) => {
        if (!user) return; 
        try {
            await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
            setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
        } catch (err) {
            console.error('Failed to delete todo:', err);
        }
    };

    // --- UPDATE (Toggle Complete Status) ---
    const handleUpdate = async (todoId, currentCompletionStatus) => {
        if (!user) return; 
        const newStatus = !currentCompletionStatus;
        
        try {
            const response = await axios.patch(`${API_URL}/${todoId}`, 
                { completed: newStatus },
                getAuthHeaders() 
            );
            
            setTodos(prevTodos => 
                prevTodos.map(todo => 
                    todo._id === todoId ? response.data : todo
                )
            );
        } catch (err) {
            console.error('Failed to update todo:', err);
        }
    };

    if (loading) return <div>Loading tasks...</div>;

    return (
        <div className="todo-container">
            <h1>MERN Stack ToDo List</h1>
            
            <TodoForm 
                onNewTodo={handleNewTodo} 
                user={user} 
                getAuthHeaders={getAuthHeaders} 
            /> 
            
            <hr/>
            
            <div className="todos-list">
                <h2>Your Tasks ({todos.length})</h2>
                {error && <div style={{ color: 'red', padding: '10px' }}>{error}</div>} 

                {todos.length === 0 && user ? (
                    <p>No tasks yet. Use the form above to add one!</p>
                ) : (
                    <ul>
                        {todos.map((todo) => (
                            <li key={todo._id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                <div style={{ flexGrow: 1, marginRight: '15px' }}>
                                    {/* 1. Task Title (Clickable) */}
                                    <span 
                                        onClick={() => toggleDescription(todo._id)}
                                        style={{ 
                                            textDecoration: todo.completed ? 'line-through' : 'none',
                                            fontWeight: 600,
                                            display: 'block',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {todo.title}
                                    </span>
                                    
                                    {/* 💡 NEW: Due Date and Alert Display */}
                                    {todo.dueDate && (
                                        <p style={{ fontSize: '0.85em', color: '#007bff', margin: '5px 0 0 0' }}>
                                            ⏱️ Due: **{formatDueDate(todo.dueDate)}**
                                            {todo.alertPreference !== 'none' && (
                                                <span style={{ marginLeft: '10px', color: '#ffc107', fontWeight: 500 }}>
                                                    (🔔 Alert: {todo.alertPreference.replace('_', ' ')})
                                                </span>
                                            )}
                                        </p>
                                    )}

                                    {/* 2. Description (Conditional Display) */}
                                    {activeTodoId === todo._id && todo.description && ( 
                                        <p 
                                            style={{ 
                                                textDecoration: todo.completed ? 'line-through' : 'none',
                                                color: '#666',
                                                marginTop: '5px',
                                                paddingLeft: '10px',
                                                borderLeft: '2px solid #ccc',
                                                fontSize: '0.9em',
                                                wordWrap: 'break-word',
                                            }}
                                        >
                                            {todo.description}
                                        </p>
                                    )}
                                </div>
                                
                                {/* 3. Delete Button */}
                                <button onClick={() => handleDelete(todo._id)} style={{ marginLeft: '10px' }}>
                                    <MdDelete size={20} /> 
                                </button>
                                
                                {/* 4. Update Button */}
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