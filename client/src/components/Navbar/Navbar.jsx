import React, { useState, useEffect } from 'react';
// import { AppBar, Typography, Toolbar, Avatar, Button } from '@mui/material'; // Remove MUI imports
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

import memoriesLogo from '../../images/memoriesLogo.png';
import memoriesText from '../../images/memoriesText.png';
import * as actionType from '../../constants/actionTypes';
// import useStyles from './styles'; // Remove useStyles

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  // const classes = useStyles(); // Remove useStyles

  const logout = () => {
    dispatch({ type: actionType.LOGOUT });

    navigate('/auth');

    setUser(null);
  };

  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = jwtDecode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);

  return (
    <nav className="bg-white py-4 shadow-md"> {/* Replace AppBar with nav and add Tailwind classes */}
      <div className="container mx-auto flex items-center justify-between"> {/* Replace Toolbar with div and add Tailwind classes */}
        <div className="flex items-center"> {/* Replace brandContainer with div and add Tailwind classes */}
          <Link to="/" className="flex items-center text-decoration-none">
            <img src={memoriesText} alt="icon" className="h-12 mr-2" />
            <img src={memoriesLogo} alt="icon" className="h-10" />
          </Link>
        </div>
        {user?.result ? (
          <div className="flex items-center space-x-4"> {/* Replace profile with div and add Tailwind classes */}
            <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center uppercase"> {/* Replace Avatar with div and add Tailwind classes */}
              {user?.result.name.charAt(0)}
            </div>
            <p className="text-gray-800">{user?.result.name}</p> {/* Replace Typography with p and add Tailwind classes */}
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={logout}>Logout</button> {/* Replace Button with button and add Tailwind classes */}
          </div>
        ) : (
          <Link to="/auth" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Sign In</Link> /* Replace Button with Link and add Tailwind classes */
        )}
      </div>
    </nav>
  );
};

export default Navbar;
