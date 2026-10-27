import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('findmyteam_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

export const projectAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  apply: (id, data) => api.post(`/projects/${id}/apply`, data)
};

export const requestAPI = {
  getIncoming: () => api.get('/requests/incoming'),
  getOutgoing: () => api.get('/requests/outgoing'),
  updateStatus: (id, status) => api.put(`/requests/${id}`, { status })
};

export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`)
};

export const teamAPI = {
  getMyTeams: () => api.get('/teams'),
  getMessages: (projectId) => api.get(`/teams/${projectId}/messages`),
  sendMessage: (projectId, content) => api.post(`/teams/${projectId}/messages`, { content })
};

export const systemAPI = {
  checkHealth: () => api.get('/health'),
  seedDatabase: () => api.post('/seed')
};

export default api;
