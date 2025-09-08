import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

export const fetchReports = (params={}) => API.get('/api/admin/reports', { params }).then(r => r.data);
export const resolveReport = (id) => API.post(`/api/admin/reports/${id}/resolve`).then(r => r.data);
export const deletePost = (id) => API.delete(`/api/admin/forum/posts/${id}`).then(r => r.data);
export const deleteComment = (id) => API.delete(`/api/admin/forum/comments/${id}`).then(r => r.data);
export const banUser = (id, body) => API.post(`/api/admin/users/${id}/ban`, body).then(r => r.data);
export const unbanUser = (id) => API.post(`/api/admin/users/${id}/unban`).then(r => r.data);
export const getPost = (id) => API.get(`/api/admin/forum/post/${id}`).then(r => r.data);
export const getComment = (id) => API.get(`/api/admin/forum/comment/${id}`).then(r => r.data);

export default { fetchReports, resolveReport, deletePost, deleteComment, banUser, unbanUser, getPost, getComment };


