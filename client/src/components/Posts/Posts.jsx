import React from 'react';
import { useSelector } from 'react-redux';
import Post from './Post/Post';

const Posts = ({ setCurrentId }) => {
  const { posts, isLoading } = useSelector((state) => state.posts);

  if (!posts?.length && !isLoading) return `<div className="text-2xl text-center mt-5">No posts</div>`;

  return (
    isLoading ? (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    ) : (
      <div className="container mx-auto">
        <div className="flex flex-wrap -mx-3 items-stretch">
          {posts?.map((post) => (
            <div key={post._id} className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 px-3 mb-6">
              <Post post={post} setCurrentId={setCurrentId} />
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default Posts;
