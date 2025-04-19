import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API = axios.create({ 
  baseURL: 'http://localhost:5000/api/v1',
  timeout: 60000, // 60 seconds
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


export const fetchPosts = (page) => API.get(`/posts?page=${page}`);
export const fetchPost = (id) => API.get(`/posts/${id}`);
export const createPost = (newPost) => API.post('/posts', newPost, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
export const deletePost = (id) => API.delete(`/posts/${id}`);

export const likePost = (id) => API.patch(`/posts/${id}/like-post`);
export const commentPost = (comment, postId) => API.post(`/posts/${postId}/comment-post`, { value: comment });

export const fetchPostsByCreator = (name) => API.get(`/posts/creator?name=${name}`);
export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);

export const signIn = (formData) => API.post('/users/sign-in', formData);
export const signUp = (formData) => API.post('/users/sign-up', formData);

export const fetchProfile = (id) => API.get(`/profile/${id}`);
export const updateProfile = (id, profileData) => API.patch(`/profile/update/${id}`, profileData);
export const uploadProfilePicture = (id, formData) => API.patch(`/profile/upload/${id}`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
