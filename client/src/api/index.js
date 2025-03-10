import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API = axios.create({ 
  baseURL: 'http://localhost:5000',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const token = profile?.token;
    
    // Check if token is expired
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp < currentTime) {
          // Token expired, clear storage and don't add to header
          localStorage.removeItem('profile');
          console.warn('Token expired, please login again');
          return req;
        }
      } catch (error) {
        console.error('Token validation error:', error);
        localStorage.removeItem('profile');
        return req;
      }
    }
    
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Handle network errors
    if (error.message === 'Network Error') {
      console.error('Network error - please check your connection');
    }
    
    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out - please try again');
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      console.error('Authentication error - please login again');
      localStorage.removeItem('profile');
      window.location.href = '/auth';
    }

    // Handle server errors
    if (error.response?.status >= 500) {
      console.error('Server error - please try again later');
    }

    return Promise.reject(error);
  }
);

export const fetchPost = (id) => API.get(`/posts/${id}`);
export const fetchPosts = (page) => API.get(`/posts?page=${page}`);
export const fetchPostsByCreator = (name) => API.get(`/posts/creator?name=${name}`);
export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);
export const createPost = (newPost) => API.post('/posts', newPost);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const comment = (value, id) => API.post(`/posts/${id}/commentPost`, { value });
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);

export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);
