import { AUTH, LOGOUT } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const signin = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);
    
    // Handle localStorage here instead of in the reducer
    localStorage.setItem('profile', JSON.stringify(data));
    
    dispatch({ type: AUTH, data });
    navigate('/');
  } catch (error) {
    console.error('Sign-in error:', error);
    // You might want to dispatch an error action here
  }
};

export const signup = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);
    
    // Handle localStorage here instead of in the reducer
    localStorage.setItem('profile', JSON.stringify(data));
    
    dispatch({ type: AUTH, data });
    navigate('/');
  } catch (error) {
    console.error('Sign-up error:', error);
    // You might want to dispatch an error action here
  }
};

export const logout = (navigate) => (dispatch) => {
  // Only remove relevant items instead of clearing all localStorage
  localStorage.removeItem('profile');
  
  dispatch({ type: LOGOUT });
  navigate('/');
};
