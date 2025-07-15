import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useUserRole } from '../../lib/Utils';
import TaskModal from './TaskModel';
import React, { useState } from 'react';
import { useUsers } from '../../lib/Utils';
import { useProjects, useCreateProject } from '../../lib/ProjectApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { FaRegTrashAlt } from 'react-icons/fa';


const columns = [
  { id: 'todo', title: 'To Do', gradient: 'bg-gradient-to-br from-blue-200 via-blue-100 to-gray-200 border-blue-400', shadow: 'shadow-[0_2px_12px_0_rgba(30,64,175,0.15)]' },
  { id: 'in_progress', title: 'In Progress', gradient: 'bg-gradient-to-br from-yellow-300 via-yellow-100 to-gray-200 border-yellow-400', shadow: 'shadow-[0_2px_12px_0_rgba(202,138,4,0.15)]' },
  { id: 'done', title: 'Done', gradient: 'bg-gradient-to-br from-green-300 via-green-100 to-gray-200 border-green-400', shadow: 'shadow-[0_2px_12px_0_rgba(22,163,74,0.15)]' },
  { id: 'tested', title: 'Tested', gradient: 'bg-gradient-to-br from-purple-300 via-purple-100 to-gray-200 border-purple-400', shadow: 'shadow-[0_2px_12px_0_rgba(139,92,246,0.15)]' },
];

const profileColors = [
  'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-pink-500', 'bg-purple-500', 'bg-red-500', 'bg-indigo-500', 'bg-teal-500',
];

export default function KanbanBoard({ tasks, onTaskCreated }: { tasks: any[], onTaskCreated?: () => void }) {
  const role = useUserRole();
  const canCreate = true; // Allow all users to create tasks
  const canEdit = role === 'Admin' || role === 'Project Manager' || role === 'Developer';
  console.log('KanbanBoard role:', role, 'canEdit:', canEdit);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [localTasks, setLocalTasks] = useState(tasks);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const { data: projects = [] } = useProjects();
  const { data: users = [] } = useUsers();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  // Projects and users are now fetched via React Query hooks

  const createTaskMutation = useMutation({
    mutationFn: async (task: any) => {
      const res = await api.post('/tasks', task);
      return res.data;
    },
    onSuccess: () => {
      setShowModal(false);
      if (onTaskCreated) onTaskCreated();
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: () => {
      alert('Failed to create task');
    }
  });
  const handleCreate = (task: any) => {
    createTaskMutation.mutate(task);
  };

  const editTaskMutation = useMutation({
    mutationFn: async (task: any) => {
      const res = await api.put(`/tasks/${task.id}`, task);
      return res.data;
    },
    onSuccess: () => {
      setEditTask(null);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: () => {
      alert('Failed to update task');
    }
  });
  const handleEdit = (task: any, optimistic?: boolean) => {
    if (optimistic) {
      setLocalTasks(prev => prev.map(t => t.id === task.id ? { ...t, ...task } : t));
    }
    editTaskMutation.mutate(task);
  };

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      const res = await api.delete(`/tasks/${taskId}`);
      return res.data;
    },
    onSuccess: () => {
      if (onTaskCreated) onTaskCreated();
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: () => {
      alert('Failed to delete task');
    }
  });
  const handleDelete = (taskId: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    deleteTaskMutation.mutate(taskId);
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;
    const task = localTasks.find(t => t.id.toString() === taskId);
    if (task && task.status !== newStatus) {
      // Optimistically update UI
      await handleEdit({ ...task, status: newStatus }, true);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      {/* Spacer for gap between Navbar and KanbanBoard */}
      <div className="h-3 sm:h-4" />
      {/* Header Row: Kanban Board, + Add Task, Project Dropdown */}
      <div className="relative z-20 bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl border border-gray-200 px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 mx-2">
        <h1 className="text-xl font-bold text-gray-800 whitespace-nowrap drop-shadow">Kanban Board</h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 w-full sm:w-auto">
          {canCreate && (
            <button
              className="bg-green-600 text-white px-4 py-1.5 rounded-lg font-semibold shadow hover:bg-green-700 transition mb-1 sm:mb-0"
              onClick={() => setShowModal(true)}
            >
              + Add Task
            </button>
          )}
          <div className="flex items-center gap-1">
            <label className="font-semibold text-gray-700" htmlFor="project-select">Project:</label>
            <div className="relative">
              <select
                id="project-select"
                value={selectedProject}
                onChange={e => setSelectedProject(e.target.value)}
                className="appearance-none px-3 py-1.5 border border-green-400 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-400 bg-white min-w-[130px] text-gray-800 font-medium transition-all duration-150 hover:border-green-500 hover:bg-green-50 pr-8"
              >
                <option value="">All Projects</option>
                {projects.map((project: any) => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-green-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </span>
            </div>
          </div>
        </div>
      </div>
      {canCreate && (
        <TaskModal open={showModal} onClose={() => setShowModal(false)} onCreate={handleCreate} />
      )}
      {editTask && (
        <TaskModal open={!!editTask} onClose={() => setEditTask(null)} onCreate={handleEdit} {...editTask} />
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 p-4 flex-1 min-h-0 w-full items-stretch">
          {columns.map(col => (
            <Droppable droppableId={col.id} key={col.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`rounded-xl flex-1 h-full flex flex-col border-2 ${col.gradient} ${col.shadow} metallic-bg`}
                  style={{
                    backgroundBlendMode: 'overlay',
                    borderRadius: '1rem',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    overflow: 'hidden',
                    position: 'relative',
                    minWidth: '0',
                  }}
                >
                  <h3 className="p-4 font-bold text-lg border-b-2 border-opacity-40 tracking-wide drop-shadow-sm" style={{textShadow: '0 1px 2px rgba(0,0,0,0.08)'}}>
                    {selectedProject
                      ? projects.find((p: any) => p.id.toString() === selectedProject)?.name || 'Project'
                      : 'All Projects'}
                    {' - '}{col.title}
                  </h3>
                  <div className="flex-1 p-2 space-y-2 min-h-0 overflow-y-auto">
                    {localTasks
                      .filter(t => t.status === col.id && (!selectedProject || t.projectId?.toString() === selectedProject))
                      .map((task, idx) => (
                        <Draggable draggableId={task.id.toString()} index={idx} key={task.id}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="relative bg-white p-4 rounded shadow hover:shadow-lg transition flex flex-col pb-10">
                              <div className="font-semibold text-base">{task.title}</div>
                              <div className="text-xs text-gray-500 mb-1">
                                {projects.find((p: any) => p.id === task.projectId)?.name || 'Project'}
                              </div>
                              <div className="text-sm text-gray-700 mb-2">{task.description}</div>
                              <div className="text-xs text-gray-400 mt-2">Due: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}</div>
                              {/* Profile icons for developer/tester, now in a flex row, not absolute */}
                              {(task.developerId || task.testerId) && (
                                <div className="flex gap-2 mt-3 mb-2">
                                  {task.developerId && (
                                    <div className="flex items-center bg-blue-50 rounded-full px-3 py-1 shadow text-sm font-medium border border-blue-200">
                                      <span className="w-2 h-2 rounded-full bg-cyan-500 mr-2 inline-block"></span>
                                      <span className="text-cyan-900">{users?.find((u: any) => u.id === task.developerId)?.name || 'Developer'}</span>
                                    </div>
                                  )}
                                  {task.testerId && (
                                    <div className="flex items-center bg-orange-50 rounded-full px-3 py-1 shadow text-sm font-medium border border-orange-200">
                                      <span className="w-2 h-2 rounded-full bg-orange-500 mr-2 inline-block"></span>
                                      <span className="text-orange-900">{users?.find((u: any) => u.id === task.testerId)?.name || 'Tester'}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                              {canEdit && (
                                <div className="flex justify-between mt-2">
                                  <button
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Edit Task"
                                    onClick={() => setEditTask(task)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="text-red-600 hover:text-red-800"
                                    title="Delete Task"
                                    onClick={() => handleDelete(task.id)}
                                  >
                                    <FaRegTrashAlt />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
