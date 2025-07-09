import React, { useState, useEffect } from 'react';
import KanbanBoard from '../components/ui/KanbanBoard';
import '../components/ui/AnimatedBlobs.css';
import api from '../lib/api';
import { fetchProjects } from '../lib/ProjectApi';
import { useSocket } from '../lib/UseSockets';
import { useNotification } from '../context/NotificationContext';

export default function DashboardPage({ renderNavbar }: { renderNavbar?: (props: any) => React.ReactNode }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket(localStorage.getItem('token') || undefined);
  const { addNotification } = useNotification();

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
      const projectName = getProjectName(data.projectId);
      const statusLabel = getStatusLabel(data.status);
      addNotification(`${data.title} of ${projectName} is updated to ${statusLabel}`);
    });
    socket.on('newTask', (data: any) => {
      setTasks(prev => [...prev, data]);
      const projectName = getProjectName(data.projectId);
      addNotification(`${data.title} of ${projectName} is created`);
    });
    return () => {
      socket.off('taskUpdated');
      socket.off('newTask');
    };
  }, [socket, projects, addNotification]);

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
    <div className="min-h-screen w-full relative flex flex-col overflow-x-hidden">
      {/* Animated SVG Blobs Background */}
      <div className="animated-blobs-bg">
        <svg className="blob1" viewBox="0 0 600 600">
          <g transform="translate(300,300)">
            <path d="M120,-170C155,-140,180,-105,190,-65C200,-25,195,20,175,60C155,100,120,135,80,160C40,185,-5,200,-50,190C-95,180,-140,145,-170,105C-200,65,-215,20,-205,-25C-195,-70,-160,-115,-120,-150C-80,-185,-40,-210,5,-215C50,-220,100,-205,120,-170Z" />
          </g>
        </svg>
        <svg className="blob2" viewBox="0 0 600 600">
          <g transform="translate(300,300)">
            <path d="M140,-180C180,-140,210,-100,220,-55C230,-10,220,35,200,80C180,125,150,170,110,200C70,230,20,245,-25,240C-70,235,-110,210,-145,180C-180,150,-210,115,-220,70C-230,25,-220,-20,-200,-65C-180,-110,-150,-155,-110,-190C-70,-225,-20,-250,30,-245C80,-240,120,-220,140,-180Z" />
          </g>
        </svg>
        <svg className="blob3" viewBox="0 0 600 600">
          <g transform="translate(300,300)">
            <path d="M110,-150C145,-120,170,-85,180,-45C190,-5,185,35,165,75C145,115,110,155,70,180C30,205,-15,215,-55,200C-95,185,-130,145,-160,105C-190,65,-215,20,-205,-25C-195,-70,-160,-115,-120,-150C-80,-185,-40,-210,5,-215C50,-220,100,-205,110,-150Z" />
          </g>
        </svg>
      </div>
      {/* Content above blobs */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {renderNavbar && renderNavbar({})}
        <div className="flex-1 flex flex-col">
          <KanbanBoard tasks={tasks} onTaskCreated={handleTaskCreated} />
        </div>
      </div>
    </div>
  );
}
