import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const getProducts = () => api.get('/products');
export const getDashboard = () => api.get('/products/dashboard');
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const generateProduct = (prompt) => api.post('/ai/generate', { prompt });
export const searchProducts = (query) => api.post('/ai/search', { query });