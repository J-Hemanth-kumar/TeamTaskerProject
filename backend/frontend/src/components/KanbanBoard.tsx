import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useUserRole } from '../lib/utils';
import TaskModal from './ui/TaskModal';
import React, { useState } from 'react';
import api from '../api';

const columns = [
  { id: 'todo', title: 'To Do' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export default function KanbanBoard({ tasks, onTaskCreated }: { tasks: any[], onTaskCreated?: () => void }) {
  const role = useUserRole();
  const canCreate = role === 'Admin' || role === 'Project Manager';
  const canEdit = role === 'Admin' || role === 'Project Manager' || role === 'Developer';
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [localTasks, setLocalTasks] = useState(tasks);

  React.useEffect(() => { setLocalTasks(tasks); }, [tasks]);

  const handleCreate = async (task: any) => {
    try {
      const res = await api.post('/tasks', task);
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
      {canCreate && (
        <>
          <button className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={() => setShowModal(true)}>
            + Add Task
          </button>
          <TaskModal open={showModal} onClose={() => setShowModal(false)} onCreate={handleCreate} />
        </>
      )}
      {editTask && (
        <TaskModal open={!!editTask} onClose={() => setEditTask(null)} onCreate={handleEdit} {...editTask} />
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 p-4 overflow-x-auto">
          {columns.map(col => (
            <Droppable droppableId={col.id} key={col.id}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="bg-gray-100 rounded-lg shadow w-80 min-h-[400px] flex flex-col">
                  <h3 className="p-4 font-bold text-lg border-b">{col.title}</h3>
                  <div className="flex-1 p-2 space-y-2">
                    {localTasks.filter(t => t.status === col.id).map((task, idx) => (
                      <Draggable draggableId={task.id.toString()} index={idx} key={task.id}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="bg-white p-4 rounded shadow hover:shadow-lg transition flex flex-col">
                            <div className="font-semibold">{task.title}</div>
                            <div className="text-sm text-gray-500">{task.description}</div>
                            <div className="text-xs text-gray-400 mt-2">Due: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}</div>
                            {canEdit && (
                              <button className="mt-2 text-blue-600 hover:underline self-end" onClick={() => setEditTask(task)}>Edit</button>
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
