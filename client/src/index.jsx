import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import App from './App';
import './index.css';

import { store } from './app/store';
import { Provider } from 'react-redux';

import { getPosts } from './features/posts/PostsSlice';

store.dispatch(getPosts());

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </Router>
      </Provider>
    </React.StrictMode>
);
