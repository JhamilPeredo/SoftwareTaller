import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://localhost:8000/api',
  baseURL: 'https://competencia-backend.onrender.com/api',  
  headers: { 'Content-Type': 'application/json' },
});

// ROLES
export const getRoles = () => api.get('/roles/');
export const createRol = (data) => api.post('/roles/', data);
export const updateRol = (id, data) => api.put(`/roles/${id}/`, data);
export const deleteRol = (id) => api.delete(`/roles/${id}/`);

// USUARIOS
export const getUsuarios = () => api.get('/usuarios/');
export const createUsuario = (data) => api.post('/usuarios/', data);
export const updateUsuario = (id, data) => api.put(`/usuarios/${id}/`, data);
export const deleteUsuario = (id) => api.delete(`/usuarios/${id}/`);
export const asignarRol = (userId, rolId) =>
  api.patch(`/usuarios/${userId}/asignar-rol/`, { rol_id: rolId });
