/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { getPosts } from '../features/posts/PostsSlice';

const Paginate = ({ page }) => {
  const { numberOfPages } = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  useEffect(() => {
    if (page) {
      dispatch(getPosts(page));
    }
  }, [dispatch, page]);

  const pageNumbers = [];

  for (let i = 1; i <= numberOfPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-4">
      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        {pageNumbers.map((number) => (
          <Link
            key={number}
            to={`/posts?page=${number}`}
            aria-current="page"
            className={`bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border-r-0 text-sm font-medium ${
              Number(page) === number ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : ''
            }`}
          >
            {number}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Paginate;
