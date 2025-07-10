import React, { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function UserMenuDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [showUsers, setShowUsers] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);

  useEffect(() => {
    if (showUsers && open) {
      setLoading(true);
      api.get('/users')
        .then(res => {
          setUsers(res.data);
          console.log('Fetched users:', res.data);
        })
        .catch(err => {
          setUsers([]);
          console.error('Error fetching users:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [showUsers, open]);

  // Group users by role
  // Map roleId to display names
  const roleDisplayMap: Record<number, string> = {
    1: 'Admin',
    2: 'Project Manager',
    3: 'Developer',
    4: 'Tester',
    5: 'Viewer',
  };
  // Group users by roleId
  const grouped = users.reduce((acc: any, user: any) => {
    const roleId = user.roleId;
    if (!acc[roleId]) acc[roleId] = [];
    acc[roleId].push(user);
    return acc;
  }, {});
  // Only show roles in the dropdown that are in the map, in the desired order
  const roleList = Object.keys(roleDisplayMap).map(Number);
  console.log('Grouped users:', grouped);

  // Drawer below navbar (assume navbar is 56px tall)
  // The modal is rendered outside the drawer, so we use a portal approach
  return (
    <>
      <div className={`fixed left-0 top-[56px] w-80 max-w-full z-40 transition-transform ${open ? 'translate-x-0' : '-translate-x-full'} h-[calc(100vh-56px)] rounded-r-2xl`} style={{ transition: 'transform 0.3s', width: '320px' }}>
          <div className="bg-white shadow-xl h-full flex flex-col rounded-r-2xl" style={{ width: '320px', maxWidth: '100%' }}>
          <div className="flex items-center justify-between p-4 border-b">
            <div className="relative w-full">
              <div
                className={`w-full bg-blue-50 rounded-lg border border-blue-100 shadow-inner transition-all duration-150 ${dropdownOpen ? 'ring-2 ring-blue-300' : ''}`}
                onClick={() => {
                  setDropdownOpen((prev) => !prev);
                  if (!users.length) {
                    setLoading(true);
                    api.get('/users')
                      .then(res => {
                        setUsers(res.data);
                        setLoading(false);
                      })
                      .catch(() => {
                        setUsers([]);
                        setLoading(false);
                      });
                  }
                }}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                style={{ cursor: 'pointer', width: '100%' }}
              >
                <div className="flex items-center justify-between px-4 py-3 select-none w-full">
                  <span className="text-lg font-semibold text-blue-700">Users</span>
                  <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </div>
                {dropdownOpen && (
                  <div className="w-full border-t border-blue-100">
                    {loading ? (
                      <div className="p-3 text-blue-500 text-center">Loading...</div>
                    ) : (
                      roleList.length === 0 ? (
                        <div className="p-3 text-gray-400 text-center">No roles</div>
                      ) : (
                        <ul className="py-1 w-full">
                          {roleList.map((roleId) => (
                            <li key={roleId} className="w-full">
                              <div
                                className="w-full px-4 py-2 rounded-lg hover:bg-blue-100 text-blue-700 font-medium transition-colors duration-100 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRole(roleId);
                                  setShowUsers(true);
                                  setDropdownOpen(false);
                                }}
                              >
                                {roleDisplayMap[roleId]}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* Removed X button, closing handled by HamburgerIcon */}
          </div>
        </div>
      </div>
      {/* Modal for users of selected role */}
      {showUsers && selectedRole !== null && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center" onClick={() => { setShowUsers(false); setSelectedRole(null); }}>
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 max-w-full relative" style={{ width: '320px' }} onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" onClick={() => { setShowUsers(false); setSelectedRole(null); }}>&times;</button>
            <h2 className="text-xl font-bold mb-4">{roleDisplayMap[selectedRole]} Users</h2>
            <div className="overflow-y-auto max-h-[60vh]">
              {loading ? (
                <div className="text-center text-gray-500">Loading...</div>
              ) : (
                grouped[selectedRole] && grouped[selectedRole].length > 0 ? (
                  <ul className="space-y-2">
                    {grouped[selectedRole].map((user: any) => (
                      <li key={user.id} className="flex flex-col bg-blue-50 rounded p-2 border border-blue-100">
                        <span className="font-medium text-gray-800">{user.name}</span>
                        <span className="text-xs text-gray-500">{user.email}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-gray-500">No users found for this role.</div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
