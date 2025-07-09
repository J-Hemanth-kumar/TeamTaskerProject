// src/App.tsx
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/ui/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Registeration from "./pages/Registeration";
import KanbanBoard from "./components/ui/KanbanBoard";

function App() {
  const [tasks, setTasks] = useState<any[]>([]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={
          <Dashboard
            renderNavbar={(props) => (
              <Navbar
                {...props}
                onLogout={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}
                onProjectCreated={() => {}}
              />
            )}
          />
        } />
        <Route path="/login" element={<Login onLogin={() => { window.location.href = '/dashboard'; }} />} />
        <Route path="/register" element={<Registeration onRegister={() => { window.location.href = '/login'; }} />} />
        <Route path="/kanban" element={<KanbanBoard tasks={tasks} />} />
      </Routes>
    </div>
  );
}

export default App;
