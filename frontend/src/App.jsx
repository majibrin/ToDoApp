// frontend/src/App.jsx

import TodoList from './components/TodoList'; // <-- Import the new component
import './App.css';

function App() {
  return (
    <div className="App">
      {/* Remove the placeholder H1 and render TodoList */}
      <TodoList /> 
    </div>
  );
}

export default App;