import React, { useState, useEffect } from 'react';
import KanbanBoard from '../components/KanbanBoard';
import api from '../api';
import { useSocket } from '../lib/useSocket';
import { useNotification } from '../lib/useNotification';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket(localStorage.getItem('token') || undefined);
  const [notification, setNotification] = useNotification(socket);

  useEffect(() => {
    api.get('/tasks')
      .then(res => setTasks(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('taskUpdated', (data: any) => {
      setTasks(prev => prev.map(t => t.id === data.id ? data : t));
    });
    socket.on('newTask', (data: any) => {
      setTasks(prev => [...prev, data]);
    });
    return () => {
      socket.off('taskUpdated');
      socket.off('newTask');
    };
  }, [socket]);

  if (loading) return <div className="p-8 text-center">Loading tasks...</div>;

  return (
    <div>
      {notification && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow z-50" onClick={() => setNotification(null)}>
          {notification}
        </div>
      )}
      <h1 className="text-2xl font-bold p-4">Kanban Board</h1>
      <KanbanBoard tasks={tasks} onTaskCreated={() => {
        setLoading(true);
        api.get('/tasks').then(res => setTasks(res.data)).finally(() => setLoading(false));
      }} />
    </div>
  );
}
