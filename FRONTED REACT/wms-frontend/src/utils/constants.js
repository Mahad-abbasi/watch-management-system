// Vite uses import.meta.env instead of process.env
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const WATCH_STATUSES = {
  IN_STOCK: 'In Stock',
  LOW_STOCK: 'Low Stock',
  OUT_OF_STOCK: 'Out of Stock'
};

export const REPAIR_STATUSES = {
  RECEIVED: 'Received',
  IN_DIAGNOSIS: 'In Diagnosis',
  AWAITING_PARTS: 'Awaiting Parts',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  DELIVERED: 'Delivered'
};