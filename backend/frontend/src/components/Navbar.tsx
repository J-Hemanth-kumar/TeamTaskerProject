
import React, { useState } from 'react';
import AdminCreateUserForm from '../components/AdminCreateUserForm';
import ProjectCreateForm from '../components/ProjectCreateForm';
import { FaBell } from 'react-icons/fa';
import { HamburgerIcon } from './icons/HamburgerIcon';
import UserMenuDrawer from './UserMenuDrawer';


export default function Navbar({ onLogout, onProjectCreated, notifications = [] }: { onLogout: () => void, onProjectCreated: () => void, notifications?: { message: string, date: string }[] }) {
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const token = localStorage.getItem('token');
  let isAdmin = false;
  let isProjectManager = false;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      isAdmin = payload.role === 'Admin';
      isProjectManager = payload.role === 'Project Manager';
    } catch {}
  }

  return (
    <>
      <nav className="w-full bg-gray-900 text-white flex items-center justify-between px-6 py-3 shadow relative">
        {/* Left: Hamburger Icon */}
        <div className="flex items-center gap-3">
          <button
            className="focus:outline-none mr-2"
            aria-label="Open user menu drawer"
            onClick={() => setDrawerOpen(true)}
          >
            <HamburgerIcon className="hover:text-yellow-400 transition" />
          </button>
          <span className="text-xl font-bold">Team Tasker</span>
        </div>
        <div className="flex items-center gap-4">
        <button
          className="relative text-white hover:text-yellow-400 focus:outline-none"
          onClick={() => setShowNotifications(v => !v)}
          aria-label="Show notifications"
        >
          <FaBell size={24} />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-xs rounded-full px-1.5 py-0.5">{notifications.length}</span>
          )}
        </button>
        {showNotifications && (
          <div className="absolute right-0 top-14 bg-white text-black rounded shadow-lg w-80 z-50 max-h-96 overflow-y-auto">
            <div className="p-4 border-b font-bold flex justify-between items-center">
              Notifications
              <button className="text-gray-500 hover:text-gray-700 text-lg" onClick={() => setShowNotifications(false)}>&times;</button>
            </div>
            <ul className="divide-y divide-gray-200">
              {notifications.length === 0 && <li className="p-4 text-center text-gray-500">No notifications</li>}
              {notifications.map((n, i) => (
                <li key={i} className="p-4">
                  <div className="font-semibold">{n.message}</div>
                  <div className="text-xs text-gray-500 mt-1">{n.date}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {isProjectManager && (
          <>
            <button
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-semibold"
              onClick={() => setShowCreateProject(true)}
            >
              + Project
            </button>
            {showCreateProject && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
                  <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" onClick={() => setShowCreateProject(false)}>&times;</button>
                  <ProjectCreateForm onProjectCreated={() => { setShowCreateProject(false); onProjectCreated(); }} />
                </div>
              </div>
            )}
          </>
        )}
        {isAdmin && (
          <>
            <button
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold"
              onClick={() => setShowCreateUser(true)}
            >
              Create User
            </button>
            {showCreateUser && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
                  <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" onClick={() => setShowCreateUser(false)}>&times;</button>
                  <AdminCreateUserForm token={token || ''} onUserCreated={() => setShowCreateUser(false)} />
                </div>
              </div>
            )}
          </>
        )}

          <button
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-semibold"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </nav>
      {/* User Drawer */}
      <UserMenuDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
