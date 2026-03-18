import axios from 'axios';
import { API_URL } from '@/utils/constants';
import { getToken } from '@/utils/helpers';

// ─── Base Axios Instance ───────────────────────────────────────
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — clear storage and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ──────────────────────────────────────────────────────
export const authAPI = {
  register: (data)  => api.post('/auth/register', data),
  login:    (data)  => api.post('/auth/login', data),
  getMe:    ()      => api.get('/auth/me'),
};

// ─── Users ─────────────────────────────────────────────────────
export const usersAPI = {
  getAll:   ()           => api.get('/users'),
  getById:  (id)         => api.get(`/users/${id}`),
  update:   (id, data)   => api.put(`/users/${id}`, data),
  delete:   (id)         => api.delete(`/users/${id}`),
};

// ─── Water Sources ─────────────────────────────────────────────
export const waterSourcesAPI = {
  getAll:        (params) => api.get('/water-sources', { params }),
  getById:       (id)     => api.get(`/water-sources/${id}`),
  create:        (data)   => api.post('/water-sources', data),
  update:        (id, data) => api.put(`/water-sources/${id}`, data),
  updateStatus:  (id, status) => api.patch(`/water-sources/${id}/status`, { status }),
  delete:        (id)     => api.delete(`/water-sources/${id}`),
};

// ─── Sensor Readings ───────────────────────────────────────────
export const sensorReadingsAPI = {
  getAll:           (params)   => api.get('/sensor-readings', { params }),
  getBySource:      (sourceId, params) => api.get(`/sensor-readings/source/${sourceId}`, { params }),
  getLatestBySource:(sourceId) => api.get(`/sensor-readings/source/${sourceId}/latest`),
  create:           (data)     => api.post('/sensor-readings', data),
  delete:           (id)       => api.delete(`/sensor-readings/${id}`),
};

// ─── Reports ───────────────────────────────────────────────────
export const reportsAPI = {
  getAll:          (params) => api.get('/reports', { params }),
  getById:         (id)     => api.get(`/reports/${id}`),
  getMy:           ()       => api.get('/reports/my'),
  getBySource:     (sourceId) => api.get(`/reports/source/${sourceId}`),
  create:          (data)   => api.post('/reports', data),
  updateStatus:    (id, status) => api.patch(`/reports/${id}/status`, { status }),
  delete:          (id)     => api.delete(`/reports/${id}`),
};

// ─── Notifications ─────────────────────────────────────────────
export const notificationsAPI = {
  getMy:          () => api.get('/notifications'),
  getUnread:      () => api.get('/notifications/unread'),
  markAsRead:     (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead:  () => api.patch('/notifications/read-all'),
  delete:         (id) => api.delete(`/notifications/${id}`),
};

// ─── Alerts ────────────────────────────────────────────────────
export const alertsAPI = {
  getAll:       (params)   => api.get('/alerts', { params }),
  getById:      (id)       => api.get(`/alerts/${id}`),
  getBySource:  (sourceId) => api.get(`/alerts/source/${sourceId}`),
  create:       (data)     => api.post('/alerts', data),
  delete:       (id)       => api.delete(`/alerts/${id}`),
};

export default api;
