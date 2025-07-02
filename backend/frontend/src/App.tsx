import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/Navbar';

function getUserRole() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch {
    return null;
  }
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [showRegister, setShowRegister] = useState(false);
  const [notifications, setNotifications] = useState<{ message: string, date: string }[]>([]);
  const role = getUserRole();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const handleProjectCreated = () => {
    // Optionally, refresh project/task data or show a notification
    window.location.reload(); // simplest way to ensure new projects are reflected everywhere
  };

  // Notification handler for KanbanBoard
  const handleTaskNotification = (message: string) => {
    setNotifications(prev => [
      { message, date: new Date().toLocaleString() },
      ...prev
    ]);
  };

  if (!isLoggedIn) {
    return showRegister ? (
      <RegisterPage onRegister={() => setShowRegister(false)} />
    ) : (
      <LoginPage onLogin={() => setIsLoggedIn(true)} />
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={handleLogout} onProjectCreated={handleProjectCreated} notifications={notifications} />
      <button onClick={handleLogout} className="absolute top-4 right-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Logout</button>
      <DashboardPage onTaskNotification={handleTaskNotification} />
    </div>
  );
}

export default App;
