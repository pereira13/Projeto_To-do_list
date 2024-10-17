import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Tarefas from './components/Tarefas';

import './App.css';

function App() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark');
  };

  return (
    <Router>
      <div className={darkMode ? 'dark' : ''}>
        <button onClick={toggleDarkMode}>
          {darkMode ? 'Modo Claro' : 'Modo Escuro'}
        </button>
        <Routes>
          <Route path="/" element={<Login setToken={setToken} setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          {user && <Route path="/tarefas" element={<Tarefas token={token} />} />}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
