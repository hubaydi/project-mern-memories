import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AiOutlineLock } from 'react-icons/ai';
import { jwtDecode } from 'jwt-decode';

import Icon from './icon';
import { signIn, signUp, selectUserStatus, selectUserError } from '../features/users/usersSlice';
import { AUTH } from '../constants/actionTypes';
import Input from './Input';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const SignUp = () => {
  const [form, setForm] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  
  const userStatus = useSelector(selectUserStatus);
  const userError = useSelector(selectUserError);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

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
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email address';
    }
    // Password validation
    if (!form.password || form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (isSignup && form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (isSignup && (!form.firstName || !form.lastName)) {
      newErrors.firstName = 'First name is required';
      newErrors.lastName = 'Last name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (isSignup) {
      await dispatch(signUp(form))
        .unwrap()
        .then(() => {
          navigate('/');
        })
        .catch((error) => {
          console.error("Sign-up failed:", error);
          setFormError(error.message);
        });
    } else {
      await dispatch(signIn(form))
        .unwrap()
        .then(() => {
          navigate('/');
        })
        .catch((error) => {
          console.error("Sign-in failed:", error);
          setFormError(error.message);
        });
    }
  };

  const googleSuccess = async (res) => {
    try {
      const token = res?.credential;
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

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
      <div className="flex flex-col items-center mb-4">
        <div className="bg-blue-500 rounded-full p-3 mb-2">
          <AiOutlineLock className="text-white text-2xl" />
        </div>
        <h2 className="text-xl font-bold mb-2">{isSignup ? 'Sign Up' : 'Sign In'}</h2>
      </div>
      {formError && <p className="text-red-500 text-xs italic mt-2">{formError}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignup && (
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
        {isSignup && (
          <Input
            name="confirmPassword"
            label="Repeat Password"
            placeholder="********"
            handleChange={handleChange}
            type={showPassword ? 'text' : 'password'}
            error={errors.confirmPassword}
          />
        )}
        <button
          type="submit"
          className={`bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-4 cursor-pointer ${userStatus === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`} 
          disabled={userStatus === 'loading'}
        >
          { userStatus === 'loading' ? 'Processing...' : (isSignup ? 'Sign Up' : 'Sign In') }
        </button>
        <div className="flex justify-center mt-4">
          <button
            type="button"
            className="text-sm text-gray-500 hover:text-blue-500"
            onClick={switchMode}
            disabled={userStatus === 'loading'}
          >
            { isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up" }
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
