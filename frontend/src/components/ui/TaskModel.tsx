import React, { useState, useEffect } from 'react';
import { useProjects } from '../../lib/ProjectApi';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';


function SearchableDropdown({ options, value, onChange, placeholder }: { options: any[], value: string, onChange: (v: string) => void, placeholder: string }) {
  const [search, setSearch] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const filtered = options.filter(opt => ((opt.name || opt.username || '').toLowerCase().includes(search.toLowerCase())));
  const getDisplayName = (opt: any) => {
    if (opt.name && opt.username && opt.name !== opt.username) return `${opt.name} (${opt.username})`;
    return opt.name || opt.username || '';
  };
  const handleSelect = (id: string, _name: string, opt: any) => {
    onChange(id);
    setSearch(getDisplayName(opt));
    setShowOptions(false);
  };
  useEffect(() => {
    if (!value) setSearch('');
    else {
      const selected = options.find(opt => String(opt.id) === String(value));
      if (selected) setSearch(getDisplayName(selected));
    }
  }, [value, options]);
  return (
    <div className="mb-3 w-full relative">
      <input
        type="text"
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setShowOptions(true);
        }}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded mb-1"
        onFocus={() => setShowOptions(true)}
        autoComplete="off"
      />
      {showOptions && (
        <div className="absolute z-10 bg-white border rounded w-full max-h-40 overflow-y-auto shadow">
          {filtered.length === 0 && <div className="p-2 text-gray-400">No results</div>}
          {filtered.map((opt: any) => (
            <div
              key={opt.id}
              className="p-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleSelect(String(opt.id), getDisplayName(opt), opt)}
            >
              {getDisplayName(opt)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TaskModal({ open, onClose, onCreate }: { open: boolean, onClose: () => void, onCreate: (task: any) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [deadline, setDeadline] = useState('');
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useProjects();
  const { data: developers = [] } = useQuery({
    queryKey: ['users', 'developers'],
    queryFn: async () => {
      const res = await api.get('/users/developers');
      return res.data;
    },
  });
  const { data: testers = [] } = useQuery({
    queryKey: ['users', 'testers'],
    queryFn: async () => {
      const res = await api.get('/users/testers');
      return res.data;
    },
  });
  const [developerId, setDeveloperId] = useState('');
  const [testerId, setTesterId] = useState('');

  // Data is now fetched via React Query hooks

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
