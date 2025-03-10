import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { jwtDecode } from 'jwt-decode';

import Icon from './icon';
import { signin, signup } from '../../actions/auth';
import { AUTH } from '../../constants/actionTypes';
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
  const handleShowPassword = () => setShowPassword(!showPassword);

  const switchMode = () => {
    setForm(initialState);
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      dispatch(signup(form, navigate));
    } else {
      dispatch(signin(form, navigate));
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
    }
  };

  const googleError = (error) => {
    console.error('Google Sign In was unsuccessful:', error);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-xs">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <LockOutlinedIcon />
            </div>
          </div>
          <h1 className="block text-gray-700 text-center text-xl font-bold mb-2">{ isSignup ? 'Sign up' : 'Sign in' }</h1>
          <form className="mb-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              { isSignup && (
                <>
                  <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                  <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                </>
              )}
              <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
              <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
              { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" /> }
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-4" type="submit">
              { isSignup ? 'Sign Up' : 'Sign In' }
            </button>
            <div className="flex items-center justify-end mt-2">
              <button className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" onClick={switchMode}>
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
