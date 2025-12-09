import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

// Pages & Components
import TodoList from './components/TodoList';
import Signup from './pages/Signup';
import Login from './pages/Login'; 
import Navbar from './components/Navbar'; 

import './App.css';

function App() {
  const { user } = useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar /> 
        <div className="pages">
          <Routes>
            {/* Home Route: Protected - requires user */}
            <Route 
              path="/" 
              element={user ? <TodoList /> : <Navigate to="/login" />} 
            />
            
            {/* Login Route: Redirects to home if user is present */}
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/" />} 
            />
            
            {/* Signup Route: Redirects to home if user is present */}
            <Route 
              path="/signup" 
              element={!user ? <Signup /> : <Navigate to="/" />} 
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;