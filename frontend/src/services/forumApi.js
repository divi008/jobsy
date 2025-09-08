import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers['x-auth-token'] = token;
  return config;
});

export const fetchPosts = (params = {}) => API.get('/api/forum/posts', { params }).then(r => r.data);
export const createPost = (data) => API.post('/api/forum/posts', data).then(r => r.data);
export const votePost = (postId, type) => API.post(`/api/forum/posts/${postId}/upvote`, { type }).then(r => r.data);
export const fetchPostDetail = (postId, params = {}) => API.get(`/api/forum/posts/${postId}`, { params }).then(r => r.data);
export const addComment = (postId, data) => API.post(`/api/forum/posts/${postId}/comments`, data).then(r => r.data);
export const voteComment = (commentId, type) => API.post(`/api/forum/comments/${commentId}/upvote`, { type }).then(r => r.data);
export const reportTarget = (payload) => API.post('/api/forum/report', payload).then(r => r.data);

export default {
  fetchPosts,
  createPost,
  votePost,
  fetchPostDetail,
  addComment,
  voteComment,
  reportTarget,
};



