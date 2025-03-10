import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// import { Typography, CircularProgress, Grid, Divider, Box } from '@mui/material'; // Remove MUI imports
import { useDispatch, useSelector } from 'react-redux';

import Post from './Posts/Post/Post';
import { getPostsByCreator, getPostsBySearch } from '../actions/posts';

const CreatorOrTag = () => {
  const { name } = useParams();
  const dispatch = useDispatch();
  const { posts, isLoading } = useSelector((state) => state.posts);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/tags')) {
      dispatch(getPostsBySearch({ tags: name }));
    } else {
      dispatch(getPostsByCreator(name));
    }
  }, []);

  if (!posts.length && !isLoading) return 'No posts';

  return (
    <div> {/* Replace Box with div */}
      <h2 className="text-2xl font-bold">{name}</h2> {/* Replace Typography with h2 and add Tailwind classes */}
      <hr className="my-4" /> {/* Replace Divider with hr and add Tailwind classes */}
      {isLoading ? 
        <div
          className="w-28 h-28 border-4 border-gray-200 rounded-full border-t-blue-500 animate-spin"
        />
      : (
        <div className="flex flex-wrap"> {/* Replace Grid with div and add Tailwind classes */}
          {posts?.map((post) => (
            <div key={post._id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"> {/* Replace Grid with div and add Tailwind classes */}
              <Post post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreatorOrTag;
