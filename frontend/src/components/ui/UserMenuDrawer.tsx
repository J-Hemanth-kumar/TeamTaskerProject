import React, { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function UserMenuDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [showUsers, setShowUsers] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (showUsers && open) {
      setLoading(true);
      api.get('/users')
        .then(res => setUsers(res.data))
        .finally(() => setLoading(false));
    }
  }, [showUsers, open]);

  // Group users by role
  const grouped = users.reduce((acc: any, user: any) => {
    if (!acc[user.role]) acc[user.role] = [];
    acc[user.role].push(user);
    return acc;
  }, {});

  // Drawer below navbar (assume navbar is 56px tall)
  // The modal is rendered outside the drawer, so we use a portal approach
  return (
    <>
      <div className={`fixed left-0 top-[56px] w-80 z-40 transition-transform ${open ? 'translate-x-0' : '-translate-x-full'} h-[calc(100vh-56px)]`} style={{ transition: 'transform 0.3s' }}>
        <div className="bg-white shadow-xl h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <button
              className="text-lg font-bold text-blue-700 hover:underline focus:outline-none"
              onClick={() => setShowUsers(true)}
            >
              Users
            </button>
            <button className="text-2xl text-gray-500 hover:text-gray-700" onClick={onClose}>&times;</button>
          </div>
        </div>
      </div>
      {/* Modal for user details, rendered centered and overshadowing dashboard */}
      {showUsers && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center" onClick={() => setShowUsers(false)}>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" onClick={() => setShowUsers(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">All Users</h2>
            <div className="overflow-y-auto max-h-[60vh]">
              {loading ? (
                <div className="text-center text-gray-500">Loading...</div>
              ) : (
                Object.keys(grouped).length === 0 ? (
                  <div className="text-center text-gray-500">No users found.</div>
                ) : (
                  Object.entries(grouped).map(([role, users]: any) => (
                    <div key={role} className="mb-6">
                      <div className="font-semibold text-blue-700 mb-2 text-base border-b pb-1">{role}</div>
                      <ul className="space-y-2">
                        {users.map((user: any) => (
                          <li key={user.id} className="flex flex-col bg-blue-50 rounded p-2 border border-blue-100">
                            <span className="font-medium text-gray-800">{user.name}</span>
                            <span className="text-xs text-gray-500">{user.email}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
