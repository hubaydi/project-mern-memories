import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { commentPost } from '../features/posts/PostsSlice'; 
import { selectUser } from '../features/users/usersSlice';

const CommentSection = ({ postId }) => {
  const post = useSelector(state => state.posts.posts.find(post => post._id === postId))
  const user = useSelector(selectUser);

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post?.comments);

  const dispatch = useDispatch();
  const commentsRef = useRef();

  const handleComment = async () => {
    const commentedPost = await dispatch(commentPost({comment: `${user?.result?.name}: ${comment}`, postId: post._id}));

    setComment('');
    setComments(commentedPost.payload.data.post.comments);

    commentsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <div className="flex flex-col">
      <div className="max-w-xl">
          <h6 className="font-bold mb-2 text-gray-500">Write a comment</h6>
          <textarea
            className="w-full border rounded py-2 px-3 mb-2 resize-none"
            rows={4}
            placeholder="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <br />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 w-full"
            disabled={!comment.length}
            onClick={handleComment}
          >
            Comment
          </button>
        </div>
        <div className="my-4">
          <h6 className="font-bold mb-2 text-gray-500">Comments {comments?.length}</h6>
          
          {comments?.map((c, i) => (
            <div className='flex gap-2 items-start m-2 bg-gray-100 p-2 rounded-lg' key={i}>  
              <img src="https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=76&q=80" className='size-10 rounded-full border-2 border-green' alt="" />
              <div className="mb-1 flex flex-col">
              <span className='font-bold'>{c.split(': ')[0]}</span>
              {c.split(':')[1]}
              </div>
            </div>
          ))}
          <div ref={commentsRef} />
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
