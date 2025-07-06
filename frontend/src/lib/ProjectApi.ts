import api from './api';

export async function fetchProjects() {
  const res = await api.get('/projects');
  return res.data;
}

export async function createProject(data: { name: string; description: string }) {
  const res = await api.post('/projects', data);
  return res.data;
}
