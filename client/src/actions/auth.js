import { AUTH } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const signin = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);

    dispatch({ type: AUTH, data });

    navigate('/');
    return data;
  } catch (error) {
    console.error('Error during sign in:', error);
    
    // Extract the error message from the response if available
    const errorMessage = error.response?.data?.message || 
                         'Failed to sign in. Please check your credentials and try again.';
    
    throw new Error(errorMessage);
  }
};

export const signup = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);

    dispatch({ type: AUTH, data });

    navigate('/');
    return data;
  } catch (error) {
    console.error('Error during sign up:', error);
    
    // Extract the error message from the response if available
    const errorMessage = error.response?.data?.message || 
                         'Failed to sign up. Please check your information and try again.';
    
    throw new Error(errorMessage);
  }
};
