import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { jwtDecode } from 'jwt-decode';

import Icon from './icon';
import { signin, signup } from '../actions/auth';
import { AUTH } from '../constants/actionTypes';
// import useStyles from './styles'; // Remove useStyles
import Input from './Input';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const SignUp = () => {
  const [form, setForm] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const styles = useStyles(); // Remove styles

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

  const switchMode = () => {
    setForm(initialState);
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
    setErrors({});
    setFormError('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    // Password validation
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Signup specific validations
    if (isSignup) {
      if (!form.firstName) {
        newErrors.firstName = 'First name is required';
      }
      
      if (!form.lastName) {
        newErrors.lastName = 'Last name is required';
      }
      
      if (form.confirmPassword !== form.password) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setFormError('');
    
    try {
      if (isSignup) {
        await dispatch(signup(form, navigate));
      } else {
        await dispatch(signin(form, navigate));
      }
    } catch (error) {
      setFormError(
        error?.response?.data?.message || 
        'An error occurred. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const googleSuccess = async (res) => {
    try {
      const token = res?.credential;
      // Using jwt-decode v4 syntax
      const decodedToken = token ? jwtDecode(token) : null;
      const result = {
        _id: decodedToken?.sub,
        name: decodedToken?.name,
        email: decodedToken?.email,
        imageUrl: decodedToken?.picture
      };

      dispatch({ type: AUTH, data: { result, token } });
      navigate('/');
    } catch (error) {
      console.error('Google Sign In error:', error);
      setFormError('Google Sign In failed. Please try again.');
    }
  };

  const googleError = (error) => {
    console.error('Google Sign In was unsuccessful:', error);
    setFormError('Google Sign In failed. Please try again.');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-xs">
        <div className="bg-white shadow-lg rounded-md px-8 pt-6 pb-2 mb-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
              <LockOutlinedIcon />
            </div>
          </div>
          <h1 className="text-blue-500 text-center text-lg font-semibold mb-4">{ isSignup ? 'Sign up' : 'Sign in' }</h1>
          
          {formError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
              {formError}
            </div>
          )}
          
          <form className="mb-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              { isSignup && (
                <div className="flex gap-2">
                  <Input 
                    name="firstName" 
                    label="First name" 
                    placeholder="John" 
                    handleChange={handleChange} 
                    autoFocus
                    error={errors.firstName}
                  />
                  <Input 
                    name="lastName" 
                    label="Last name" 
                    placeholder="Doe" 
                    handleChange={handleChange}
                    error={errors.lastName}
                  />
                </div>
              )}
              <Input 
                name="email" 
                label="Email Address" 
                placeholder="john.doe@example.com" 
                handleChange={handleChange} 
                type="email" 
                error={errors.email}
              />
              <Input 
                name="password" 
                label="Password" 
                placeholder="********" 
                handleChange={handleChange} 
                type={showPassword ? 'text' : 'password'} 
                handleShowPassword={handleShowPassword} 
                error={errors.password}
              />
              { isSignup && 
                <Input 
                  name="confirmPassword" 
                  label="Repeat Password" 
                  placeholder="********" 
                  handleChange={handleChange} 
                  type="password" 
                  error={errors.confirmPassword}
                /> 
              }
            </div>
            <button 
              className={`bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-4 cursor-pointer ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} 
              type="submit"
              disabled={isSubmitting}
            >
              { isSubmitting ? 'Processing...' : (isSignup ? 'Sign Up' : 'Sign In') }
            </button>
            <div className="flex justify-center mt-4">
              <button 
                type="button"
                className="text-sm text-gray-500 hover:text-blue-500" 
                onClick={switchMode}
                disabled={isSubmitting}
              >
                { isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign Up" }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
