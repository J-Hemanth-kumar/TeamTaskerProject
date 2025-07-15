import React, { useState } from 'react';
import api from '../lib/api';
import { useMutation } from '@tanstack/react-query';
import { useNotification } from '../context/NotificationContext';

export default function RegisterPage({ onRegister }: { onRegister: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [roleId, setRoleId] = useState(2); // Default to Developer
  const [error, setError] = useState('');

  const { addNotification } = useNotification();

  const registerMutation = useMutation({
    mutationFn: async ({ email, password, name, roleId }: { email: string; password: string; name: string; roleId: number }) => {
      const res = await api.post('/auth/register', { email, password, name, roleId });
      return res.data;
    },
    onSuccess: () => {
      addNotification('Registration successful. Please login.');
      onRegister();
    },
    onError: (err: any) => {
      const backendMsg = err.response?.data?.error;
      const backendDetails = err.response?.data?.details;
      if (backendMsg && backendDetails) {
        setError(`${backendMsg}: ${typeof backendDetails === 'string' ? backendDetails : JSON.stringify(backendDetails)}`);
      } else if (backendMsg) {
        setError(backendMsg);
      } else {
        setError('Registration failed');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    registerMutation.mutate({ email, password, name, roleId });
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
          <option value={1}>Admin</option>
          <option value={2}>Project Manager</option>
          <option value={3}>Developer</option>
          <option value={4}>Tester</option>
          <option value={5}>Viewer</option>
        </select>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          disabled={registerMutation.status === 'pending'}
        >
          {registerMutation.status === 'pending' ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
