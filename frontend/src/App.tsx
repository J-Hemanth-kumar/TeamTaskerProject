
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/ui/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Registeration from "./pages/Registeration";
import KanbanBoard from "./components/ui/KanbanBoard";


function App() {
  const [notifications, setNotifications] = useState<{ message: string; date: string }[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  // Navigation helpers for auth
  const navigate = typeof useNavigate === 'function' ? useNavigate() : undefined;

  // Handlers for Navbar
  const handleLogout = () => {
    localStorage.removeItem('token');
    if (navigate) navigate('/login');
    window.location.href = '/login';
  };
  const handleProjectCreated = () => {
    setNotifications((prev) => [
      { message: 'Project created successfully!', date: new Date().toLocaleString() },
      ...prev,
    ]);
  };

  // Handlers for Login/Register
  const handleLogin = () => {
    setNotifications((prev) => [
      { message: 'Login successful!', date: new Date().toLocaleString() },
      ...prev,
    ]);
    if (navigate) navigate('/dashboard');
    window.location.href = '/dashboard';
  };
  const handleRegister = () => {
    setNotifications((prev) => [
      { message: 'Registration successful! Please login.', date: new Date().toLocaleString() },
      ...prev,
    ]);
    if (navigate) navigate('/login');
    window.location.href = '/login';
  };

  // Handler for KanbanBoard
  const handleTaskCreated = () => {
    setNotifications((prev) => [
      { message: 'Task created successfully!', date: new Date().toLocaleString() },
      ...prev,
    ]);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar
          onLogout={handleLogout}
          onProjectCreated={handleProjectCreated}
          notifications={notifications}
        />
        <div className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard onTaskNotification={(msg) => setNotifications((prev) => [{ message: msg, date: new Date().toLocaleString() }, ...prev])} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Registeration onRegister={handleRegister} />} />
            <Route path="/kanban" element={<KanbanBoard tasks={tasks} onTaskCreated={handleTaskCreated} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
