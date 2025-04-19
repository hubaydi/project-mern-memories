import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {selectAllPosts, getPostsStatus, getPostsError} from "./PostsSlice"
import Post from './Post/Post';

const Posts = ({ setCurrentId }) => {
  const allPosts = useSelector(selectAllPosts)
  const postStatus = useSelector(getPostsStatus);
  const error = useSelector(getPostsError);

  useEffect(() => {
    if (postStatus === 'succeeded') {
      console.log(allPosts);
    }
  }, [postStatus, allPosts]);
  
  let content;

  if (postStatus === 'loading') {
    content = (<div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full size-32 border-t-2 border-b-2 border-purple-500"></div>
    </div>)
  } else if (postStatus === 'succeeded') {
    content = (<div className="container mx-auto mb-4">
                <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                  {allPosts?.map((post) => (
                    <div key={post._id} className="flex justify-center min-w-[220px] break-inside-avoid mb-4">
                      <Post postId={post._id}  setCurrentId={setCurrentId} />
                    </div>
                  ))}
                </div>
              </div>);
  } else if (postStatus === 'failed') {
    content = <div className="text-red-500 text-center">{error}</div>;
  }

  return (
  content
  );
};

export default Posts;
