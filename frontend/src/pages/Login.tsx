import React, { useState } from 'react';
import api from '../lib/api';

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      onLogin();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400 animate-gradient-x">
      <form onSubmit={handleSubmit} className="bg-white bg-opacity-90 p-10 rounded-2xl shadow-2xl w-full max-w-sm border-t-8 border-blue-600">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700 drop-shadow">Welcome Back!</h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mb-4 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="mb-6 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold shadow hover:from-blue-700 hover:to-purple-700 transition-all">Login</button>
        <div className="mt-6 text-center text-gray-500 text-xs">Team Tasker &copy; 2025</div>
      </form>
      <style>{`
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 6s ease-in-out infinite;
        }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
