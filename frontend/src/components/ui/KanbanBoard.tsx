import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useUserRole } from '../../lib/Utils';
import TaskModal from './TaskModel';
import React, { useState } from 'react';
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
  const canCreate = role === 'Admin' || role === 'Project Manager';
  const canEdit = role === 'Admin' || role === 'Project Manager' || role === 'Developer';
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [localTasks, setLocalTasks] = useState(tasks);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  React.useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  React.useEffect(() => {
    // Fetch projects for heading
    import('../../lib/ProjectApi').then(({ fetchProjects }) => {
      fetchProjects().then(setProjects);
    });
    // Fetch users for assignee display
    api.get('/users').then(res => setUsers(res.data)).catch(() => setUsers([]));
  }, []);

  const handleCreate = async (task: any) => {
    try {
      await api.post('/tasks', task);
      setShowModal(false);
      if (onTaskCreated) onTaskCreated();
    } catch (err) {
      alert('Failed to create task');
    }
  };

  const handleEdit = async (task: any) => {
    try {
      await api.put(`/tasks/${task.id}`, task);
      setEditTask(null);
      if (onTaskCreated) onTaskCreated();
    } catch (err) {
      alert('Failed to update task');
    }
  };

  const handleDelete = async (taskId: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      if (onTaskCreated) onTaskCreated();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;
    const task = localTasks.find(t => t.id.toString() === taskId);
    if (task && task.status !== newStatus) {
      await handleEdit({ ...task, status: newStatus });
    }
  };

  return (
    <div>
      {/* Header Row: Kanban Board, + Add Task, Project Dropdown */}
      <div className="bg-white/60 backdrop-blur-md shadow-lg rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 mx-4">
        <h1 className="text-2xl font-bold text-gray-800 whitespace-nowrap">Kanban Board</h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          {canCreate && (
            <button
              className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition mb-2 sm:mb-0"
              onClick={() => setShowModal(true)}
            >
              + Add Task
            </button>
          )}
          <div className="flex items-center gap-2">
            <label className="font-semibold text-gray-700" htmlFor="project-select">Project:</label>
            <select
              id="project-select"
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white min-w-[140px]"
            >
              <option value="">All Projects</option>
              {projects.map((project: any) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
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
        <div className="flex gap-4 p-4 overflow-x-auto">
          {columns.map(col => (
            <Droppable droppableId={col.id} key={col.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`rounded-xl w-80 min-h-[400px] flex flex-col border-2 ${col.gradient} ${col.shadow} metallic-bg`}
                  style={{
                    backgroundBlendMode: 'overlay',
                    borderRadius: '1rem',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <h3 className="p-4 font-bold text-lg border-b-2 border-opacity-40 tracking-wide drop-shadow-sm" style={{textShadow: '0 1px 2px rgba(0,0,0,0.08)'}}>
                    {selectedProject
                      ? projects.find((p: any) => p.id.toString() === selectedProject)?.name || 'Project'
                      : 'All Projects'}
                    {' - '}{col.title}
                  </h3>
                  <div className="flex-1 p-2 space-y-2">
                    {localTasks
                      .filter(t => t.status === col.id && (!selectedProject || t.projectId?.toString() === selectedProject))
                      .map((task, idx) => (
                        <Draggable draggableId={task.id.toString()} index={idx} key={task.id}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="bg-white p-4 rounded shadow hover:shadow-lg transition flex flex-col">
                              <div className="font-semibold text-base">{task.title}</div>
                              <div className="text-xs text-gray-500 mb-1">
                                {projects.find((p: any) => p.id === task.projectId)?.name || 'Project'}
                              </div>
                              <div className="text-sm text-gray-700 mb-2">{task.description}</div>
                              <div className="text-xs text-gray-400 mt-2">Due: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}</div>
                              {(task.developerId || task.testerId) && (
                                <div className="absolute bottom-2 left-2 flex gap-2">
                                  {task.developerId && (
                                    <div className={`relative group w-8 h-8 rounded-full flex items-center justify-center shadow ${profileColors[task.developerId % profileColors.length]}`}
                                      title="Developer">
                                      <span className="text-white font-bold">D</span>
                                      <span className="absolute left-10 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
                                        {users?.find((u: any) => u.id === task.developerId)?.name || 'Developer'}
                                      </span>
                                    </div>
                                  )}
                                  {task.testerId && (
                                    <div className={`relative group w-8 h-8 rounded-full flex items-center justify-center shadow ${profileColors[task.testerId % profileColors.length]}`}
                                      title="Tester">
                                      <span className="text-white font-bold">T</span>
                                      <span className="absolute left-10 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
                                        {users?.find((u: any) => u.id === task.testerId)?.name || 'Tester'}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                              {canEdit && (
                                <button
                                  className="mt-2 text-red-600 hover:text-red-800 self-end"
                                  title="Delete Task"
                                  onClick={() => handleDelete(task.id)}
                                >
                                  <FaRegTrashAlt />
                                </button>
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
