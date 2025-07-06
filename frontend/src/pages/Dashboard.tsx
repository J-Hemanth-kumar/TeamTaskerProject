import React, { useState, useEffect } from 'react';
import KanbanBoard from '../components/ui/KanbanBoard';
import api from '../lib/api';
import { fetchProjects } from '../lib/ProjectApi';
import { useSocket } from '../lib/UseSockets';
import { useNotification } from '../lib/UseNotification';

export default function DashboardPage({ onTaskNotification }: { onTaskNotification?: (msg: string) => void }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket(localStorage.getItem('token') || undefined);
  const [notification, setNotification] = useNotification(socket);

  useEffect(() => {
    api.get('/tasks')
      .then(res => setTasks(res.data))
      .finally(() => setLoading(false));
    fetchProjects().then(setProjects);
  }, []);

  const handleTaskCreated = () => {
    setLoading(true);
    api.get('/tasks').then(res => setTasks(res.data)).finally(() => setLoading(false));
    // Notification for creation will be handled by socket event
  };

  useEffect(() => {
    if (!socket) return;
    const getProjectName = (projectId: any) => {
      const project = projects.find((p: any) => p.id === projectId);
      return project ? project.name : 'Project';
    };
    const getStatusLabel = (status: string) => {
      switch (status) {
        case 'in_progress': return 'In Progress';
        case 'done': return 'Completed';
        case 'tested': return 'Tested';
        default: return 'To Do';
      }
    };
    socket.on('taskUpdated', (data: any) => {
      setTasks(prev => prev.map(t => t.id === data.id ? data : t));
      if (onTaskNotification) {
        const projectName = getProjectName(data.projectId);
        const statusLabel = getStatusLabel(data.status);
        onTaskNotification(`${data.title} of ${projectName} is updated to ${statusLabel}`);
      }
    });
    socket.on('newTask', (data: any) => {
      setTasks(prev => [...prev, data]);
      if (onTaskNotification) {
        const projectName = getProjectName(data.projectId);
        onTaskNotification(`${data.title} of ${projectName} is created`);
      }
    });
    return () => {
      socket.off('taskUpdated');
      socket.off('newTask');
    };
  }, [socket, projects]);

  // Check for Project Manager role from JWT/localStorage (assume token is stored in localStorage)
  const token = localStorage.getItem('token');
  let isProjectManager = false;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      isProjectManager = payload.role === 'Project Manager';
    } catch {}
  }

  if (loading) return <div className="p-8 text-center">Loading tasks...</div>;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-green-100">
      {notification && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow z-50" onClick={() => setNotification(null)}>
          {notification}
        </div>
      )}
      <KanbanBoard tasks={tasks} onTaskCreated={handleTaskCreated} />
    </div>
  );
}
