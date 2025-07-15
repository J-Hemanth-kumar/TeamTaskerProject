export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

// Example React Query usage for users (can be moved to a dedicated file)
import { useQuery } from '@tanstack/react-query';
import api from './api';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/users');
      return res.data;
    },
  });
}

export function useUserRole() {
  // Example: decode JWT to get role, or fetch from backend
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('JWT payload:', payload);
    // Support both role and roleId (for legacy and new tokens)
    if (payload.role) return payload.role;
    if (payload.roleId) {
      // Map roleId to role name (adjust as per your roles table)
      const roleMap: { [key: number]: string } = {
        1: 'Admin',
        2: 'Project Manager',
        3: 'Developer',
        4: 'Tester',
      };
      const roleIdNum = Number(payload.roleId);
      return roleMap[roleIdNum] || null;
    }
    return null;
  } catch {
    return null;
  }
}
