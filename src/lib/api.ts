import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL!;
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Always use latest baseURL + attach token
api.interceptors.request.use((config) => {
  config.baseURL = BASE_URL;
  const token = localStorage.getItem('token');
  if (token) {
    (config.headers as any) = {
      ...(config.headers as any),
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// Health check
export const system = {
  health: () => api.get('/health'),
};

// Auth endpoints
export const auth = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// Bug endpoints
export const bugs = {
  list: (params?: { topic?: string; q?: string; limit?: number }) =>
    api.get('/bugs', { params }),
  get: (bugId: string) => api.get(`/bugs/${bugId}`),
  create: (formData: FormData) =>
    api.post('/bugs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (bugId: string, data: any) => api.put(`/bugs/${bugId}`, data),
  delete: (bugId: string) => api.delete(`/bugs/${bugId}`),
};

// Comment endpoints
export const comments = {
  add: (bugId: string, data: { text: string; parent_comment_id?: string }) =>
    api.post(`/comments/${bugId}`, data),
  delete: (commentId: string) => api.delete(`/comments/${commentId}`),
};

// Like endpoints
export const likes = {
  toggle: (data: { target_type: string; target_id: string }) =>
    api.post('/likes', data),
};

export default api;