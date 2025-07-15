import React, { useState } from 'react';
import { useCreateProject } from '../../lib/ProjectApi';

export default function ProjectCreateForm({ onProjectCreated }: { onProjectCreated: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const createProjectMutation = useCreateProject();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    createProjectMutation.mutate(
      { name, description },
      {
        onSuccess: () => {
          setName('');
          setDescription('');
          onProjectCreated();
        },
        onError: (err: any) => {
          setError(err?.message || 'Failed to create project');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 w-full max-w-md">
      <h2 className="text-lg font-bold mb-4">Create New Project</h2>
      <input
        type="text"
        placeholder="Project Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="mb-3 w-full px-3 py-2 border rounded text-black"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="mb-3 w-full px-3 py-2 border rounded text-black"
      />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button
        type="submit"
        className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
        disabled={createProjectMutation.status === 'pending'}
      >
        {createProjectMutation.status === 'pending' ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  );
}
