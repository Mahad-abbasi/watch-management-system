import api from './api';

export const watchService = {
  getAll:   ()         => api.get('/watches'),
  getById:  (id)       => api.get(`/watches/${id}`),
  create:   (data)     => api.post('/watches', data),
  update:   (id, data) => api.put(`/watches/${id}`, data),
  delete:   (id)       => api.delete(`/watches/${id}`),
};