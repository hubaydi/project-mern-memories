import React from 'react';
// import { Container } from '@mui/material'; // Remove MUI import
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import PostDetails from './components/PostDetails';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Auth from './components/Auth';
import CreatorOrTag from './components/CreatorOrTag';

const App = () => {
  const user = JSON.parse(localStorage.getItem('profile'));

  return (
    <BrowserRouter>
      <div className="max-w-7xl mx-auto px-5 lg:py-8"> {/* Replace Container with div and apply Tailwind classes */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/posts" replace />} />
          <Route path="/posts" element={<Home />} />
          <Route path="/posts/search" element={<Home />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/creators/:name" element={<CreatorOrTag />} />
          <Route path="/tags/:name" element={<CreatorOrTag />} />
          <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/posts" replace />} />
        </Routes>
      </div> {/* Replace Container with div */}
    </BrowserRouter>
  );
};

export default App;
