import React, { useState, useEffect } from 'react';
import { fetchProjects } from '../../lib/ProjectApi';
import api from '../../lib/api';

function SearchableDropdown({ options, value, onChange, placeholder }: { options: any[], value: string, onChange: (v: string) => void, placeholder: string }) {
  const [search, setSearch] = useState('');
  const filtered = options.filter(opt => (opt.name || opt.username || '').toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="mb-3 w-full relative">
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded mb-1"
      />
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      >
        <option value="">{placeholder}</option>
        {filtered.map((user: any) => (
          <option key={user.id} value={user.id}>{user.name || user.username}</option>
        ))}
      </select>
    </div>
  );
}

export default function TaskModal({ open, onClose, onCreate }: { open: boolean, onClose: () => void, onCreate: (task: any) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [deadline, setDeadline] = useState('');
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [developers, setDevelopers] = useState<any[]>([]);
  const [testers, setTesters] = useState<any[]>([]);
  const [developerId, setDeveloperId] = useState('');
  const [testerId, setTesterId] = useState('');

  useEffect(() => {
    fetchProjects().then(setProjects).catch(() => setProjects([]));
    api.get('/users/developers').then(res => setDevelopers(res.data)).catch(() => setDevelopers([]));
    api.get('/users/testers').then(res => setTesters(res.data)).catch(() => setTesters([]));
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create Task</h2>
        <form onSubmit={e => { e.preventDefault(); onCreate({ title, description, status, deadline, projectId: Number(projectId), developerId: developerId ? Number(developerId) : null, testerId: testerId ? Number(testerId) : null }); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="px-3 py-2 border rounded"
                required
              />
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="px-3 py-2 border rounded"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
                <option value="tested">Tested</option>
              </select>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="px-3 py-2 border rounded"
              />
              <SearchableDropdown
                options={projects}
                value={projectId}
                onChange={setProjectId}
                placeholder="Select Project"
              />
            </div>
            <div className="flex flex-col gap-3">
              <textarea
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="px-3 py-2 border rounded min-h-[90px]"
              />
              <SearchableDropdown
                options={developers}
                value={developerId}
                onChange={setDeveloperId}
                placeholder="Assign Developer"
              />
              <SearchableDropdown
                options={testers}
                value={testerId}
                onChange={setTesterId}
                placeholder="Assign Tester"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
