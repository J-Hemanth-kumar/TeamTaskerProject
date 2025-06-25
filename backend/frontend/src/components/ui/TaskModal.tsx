import React, { useState } from 'react';

export default function TaskModal({ open, onClose, onCreate }: { open: boolean, onClose: () => void, onCreate: (task: any) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [deadline, setDeadline] = useState('');

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create Task</h2>
        <form onSubmit={e => { e.preventDefault(); onCreate({ title, description, status, deadline }); }}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="mb-3 w-full px-3 py-2 border rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="mb-3 w-full px-3 py-2 border rounded"
          />
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="mb-3 w-full px-3 py-2 border rounded"
          >
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <input
            type="date"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            className="mb-3 w-full px-3 py-2 border rounded"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
