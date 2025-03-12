import React from 'react';
import { useSelector } from 'react-redux';
import Post from './Post/Post';

const Posts = ({ setCurrentId }) => {
  const { posts, isLoading } = useSelector((state) => state.posts);

  if (!posts?.length && !isLoading) return <div className="text-2xl text-center mt-5">No posts</div>;

  return (
    isLoading ? (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full size-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    ) : (
      <div className="container mx-auto mb-4">
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {posts?.map((post) => (
            <div key={post._id} className="flex justify-center min-w-[220px] break-inside-avoid mb-4">
              <Post post={post} setCurrentId={setCurrentId} />
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default Posts;
