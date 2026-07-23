import api from './api';

export const orderService = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  getInvoiceData: (id) => api.get(`/orders/${id}/invoice`)
};