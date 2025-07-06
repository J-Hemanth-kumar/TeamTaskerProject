import React, { useState } from 'react';
import api from '../lib/api';

export default function RegisterPage({ onRegister }: { onRegister: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [roleId, setRoleId] = useState(2); // Default to Developer
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', { email, password, name, roleId });
      onRegister();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6">Register</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="mb-4 w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mb-4 w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="mb-4 w-full px-3 py-2 border rounded"
          required
        />
        <select
          value={roleId}
          onChange={e => setRoleId(Number(e.target.value))}
          className="mb-6 w-full px-3 py-2 border rounded"
        >
          <option value={2}>Developer</option>
          <option value={3}>Tester</option>
          <option value={4}>Viewer</option>
        </select>
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Register</button>
      </form>
    </div>
  );
}
