import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchProjects } from '../../lib/ProjectApi';

const roles = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Project Manager' },
  { id: 3, name: 'Developer' },
  { id: 4, name: 'Tester' },
  { id: 5, name: 'Viewer' },
];

export default function AdminCreateUserForm({ token, onUserCreated }: { token: string; onUserCreated?: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', roleId: '', projectId: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetchProjects().then(setProjects).catch(() => setProjects([]));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(
        'http://localhost:5000/api/auth/admin/create-user',
        { ...form, roleId: Number(form.roleId), projectId: form.projectId ? Number(form.projectId) : undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('User created successfully!');
      setForm({ name: '', email: '', password: '', roleId: '', projectId: '' });
      if (onUserCreated) onUserCreated();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700 tracking-wide">Create User</h2>
      {error && <div className="text-red-500 text-center mb-2">{error}</div>}
      {success && <div className="text-green-600 text-center mb-2">{success}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <label htmlFor="name" className="font-semibold text-gray-700">Name</label>
          <input
            className="border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300 bg-white text-gray-900 placeholder-gray-400"
            id="name"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <label htmlFor="email" className="font-semibold text-gray-700">Email</label>
          <input
            className="border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300 bg-white text-gray-900 placeholder-gray-400"
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="password" className="font-semibold text-gray-700">Password</label>
          <input
            className="border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300 bg-white text-gray-900 placeholder-gray-400"
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="roleId" className="font-semibold text-gray-700">Role</label>
          <select
            className="border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300 bg-white text-gray-900"
            id="roleId"
            name="roleId"
            value={form.roleId}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          <label htmlFor="projectId" className="font-semibold text-gray-700">Assign to Project</label>
          <select
            className="border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300 bg-white text-gray-900"
            id="projectId"
            name="projectId"
            value={form.projectId}
            onChange={handleChange}
          >
            <option value="">(Optional)</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
