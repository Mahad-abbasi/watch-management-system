import api from './api';

export const repairService = {
  getAll:       ()              => api.get('/repairs'),
  getById:      (id)            => api.get(`/repairs/${id}`),
  save:         (data)          => api.post('/repairs', data),
  update:       (id, data)      => api.put(`/repairs/${id}`, data),
  delete:       (id)            => api.delete(`/repairs/${id}`),
  updateStatus: (id, status)    => api.patch(`/repairs/${id}/status`, { status }),
};