import React, { useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

import memoriesText from '../images/memoriesText.png'; 
import { selectUser, logout as logoutAction } from '../features/users/usersSlice';

const Navbar = () => {
  const user = useSelector(selectUser);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const logout = useCallback(() => {
    dispatch(logoutAction());
    navigate('/auth');
  }, [dispatch, navigate]);

  useEffect(() => {
    const token = user?.token;
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < new Date().getTime()) {
          logout();
        }
      } catch (error) {
        console.error("Token decoding error:", error);
        logout();
      }
    }
  }, [user, logout]);

  return (
    <nav className="bg-white my-4 px-4 py-4 rounded-md shadow-md"> 
      <div className="container mx-auto flex items-center justify-between"> 
        <div className="flex items-center"> 
          <Link to="/" className="flex items-center text-decoration-none">
            <img src={memoriesText} alt="icon" className="h-6 mr-2" />
          </Link>
        </div>
        {user?.result ? (
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="size-6 md:size-10 rounded-full bg-purple-500 text-white flex items-center justify-center uppercase"> 
              {user?.result.name.charAt(0)}
            </div>
            <Link to={`/profile/${user?.result?._id}`} className="text-gray-800 text-sm md:text-base font-semibold mr-7">{user?.result.name}</Link> 
            <button className="bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold py-2 px-4 rounded" onClick={logout}>Logout</button> 
          </div>
        ) : (
          <Link to="/auth" className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-md">Sign In</Link> 
        )}
      </div>
    </nav>
  );
};

export default Navbar;
