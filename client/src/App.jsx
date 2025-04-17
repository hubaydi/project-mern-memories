import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import PostDetails from './features/posts/PostDetails';
import Home from './components/Home';
import Auth from './components/Auth';
import CreatorOrTag from './components/CreatorOrTag';
import ProfilePage from './features/profile/ProfilePage';

import Layout from './components/Layout';

const App = () => {
  const user = JSON.parse(localStorage.getItem('profile'));

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/posts" replace />} />
        <Route path="posts" element={<Home />} />
        <Route path="posts/search" element={<Home />} />
        <Route path="posts/:id" element={<PostDetails />} />
        <Route path="creators/:name" element={<CreatorOrTag />} />
        <Route path="tags/:name" element={<CreatorOrTag />} />
        <Route path="profile/:id" element={<ProfilePage />} />
      </Route>
      <Route
        path="/auth"
        element={!user ? <Auth /> : <Navigate to="/posts" replace />}
      />
    </Routes>
  );
};

export default App;
