import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Нормализация URL изображений - заменяет localhost:3000 на относительный путь
const normalizeImageUrl = (url) => {
  if (!url) return url;
  return url.replace(/^https?:\/\/localhost:\d+/, '');
};

// Рекурсивная нормализация всех URL в объекте
const normalizeUrls = (data) => {
  if (!data) return data;
  if (Array.isArray(data)) {
    return data.map(normalizeUrls);
  }
  if (typeof data === 'object') {
    const result = {};
    for (const key of Object.keys(data)) {
      if ((key === 'imageUrl' || key === 'photoUrl' || key === 'url') && typeof data[key] === 'string') {
        result[key] = normalizeImageUrl(data[key]);
      } else {
        result[key] = normalizeUrls(data[key]);
      }
    }
    return result;
  }
  return data;
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // Нормализуем URL изображений в ответе
    if (response.data) {
      response.data = normalizeUrls(response.data);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Users
export const usersApi = {
  getAll: () => api.get('/users'),
  getStudents: () => api.get('/users/students'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.patch(`/users/${id}`, data),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  getStats: () => api.get('/users/stats'),
  getPendingTeachers: () => api.get('/users/pending-teachers'),
  approveTeacher: (id) => api.patch(`/users/${id}/approve-teacher`),
  rejectTeacher: (id) => api.patch(`/users/${id}/reject-teacher`),
};

// Achievements
export const achievementsApi = {
  getAll: () => api.get('/achievements'),
  getByUserId: (userId) => api.get(`/achievements/user/${userId}`),
  getById: (id) => api.get(`/achievements/${id}`),
  create: (data) => api.post('/achievements', data),
  update: (id, data) => api.patch(`/achievements/${id}`, data),
  delete: (id) => api.delete(`/achievements/${id}`),
};

// Events
export const eventsApi = {
  getAll: (type) => api.get('/events', { params: { type } }),
  getById: (id) => api.get(`/events/${id}`),
  getMy: () => api.get('/events/my'),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.patch(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  register: (id) => api.post(`/events/${id}/register`),
  unregister: (id) => api.delete(`/events/${id}/register`),
  getRegistrations: (id) => api.get(`/events/${id}/registrations`),
};

// Ratings
export const ratingsApi = {
  getAll: (period = 'all', limit = 100) => api.get(`/ratings?period=${period}&limit=${limit}`),
  getByUserId: (userId) => api.get(`/ratings/user/${userId}`),
};

// Homework
export const homeworkApi = {
  getAll: () => api.get('/homework'),
  getMy: () => api.get('/homework/my'),
  getById: (id) => api.get(`/homework/${id}`),
  create: (data) => api.post('/homework', data),
  update: (id, data) => api.patch(`/homework/${id}`, data),
  delete: (id) => api.delete(`/homework/${id}`),
  submit: (id, data) => api.post(`/homework/${id}/submit`, data),
  grade: (id, studentId, data) => api.patch(`/homework/${id}/grade/${studentId}`, data),
  getSubmissions: (id) => api.get(`/homework/${id}/submissions`),
};

// Projects
export const projectsApi = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.patch(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

// Articles
export const articlesApi = {
  getAll: (params) => api.get('/articles', { params }),
  getLatest: (limit = 2) => api.get('/articles/latest', { params: { limit } }),
  getByIdOrSlug: (idOrSlug) => api.get(`/articles/${idOrSlug}`),
  create: (data) => api.post('/articles', data),
  update: (id, data) => api.patch(`/articles/${id}`, data),
  delete: (id) => api.delete(`/articles/${id}`),
};

// Materials
export const materialsApi = {
  getAll: (category) => api.get('/materials', { params: { category } }),
  getById: (id) => api.get(`/materials/${id}`),
  create: (data) => api.post('/materials', data),
  update: (id, data) => api.patch(`/materials/${id}`, data),
  delete: (id) => api.delete(`/materials/${id}`),
  download: (id) => api.post(`/materials/${id}/download`),
};

// Uploads
export const uploadsApi = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/uploads/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;
