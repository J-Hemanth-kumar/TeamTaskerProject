import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return showRegister ? (
      <RegisterPage onRegister={() => setShowRegister(false)} />
    ) : (
      <LoginPage onLogin={() => setIsLoggedIn(true)} />
    );
  }
  return (
    <div>
      <button onClick={handleLogout} className="absolute top-4 right-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Logout</button>
      <DashboardPage />
    </div>
  );
}

export default App;
