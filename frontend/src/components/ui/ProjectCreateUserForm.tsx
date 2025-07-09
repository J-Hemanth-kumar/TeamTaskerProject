import React, { useState } from 'react';
import { createProject } from '../../lib/ProjectApi';

export default function ProjectCreateForm({ onProjectCreated }: { onProjectCreated: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createProject({ name, description });
      setName('');
      setDescription('');
      onProjectCreated();
    } catch (err: any) {
      setError(err?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
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
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  );
}
