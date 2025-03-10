import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { commentPost } from '../actions/posts';

const CommentSection = ({ post }) => {
  const user = JSON.parse(localStorage.getItem('profile'));
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  const [comments, setComments] = useState(post?.comments);
  const commentsRef = useRef();

  const handleComment = async () => {
    const newComments = await dispatch(commentPost(`${user?.result?.name}: ${comment}`, post._id));

    setComment('');
    setComments(newComments);

    commentsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <h6 className="font-bold mb-2">Comments</h6>
          {comments?.map((c, i) => (
            <p key={i} className="mb-1">
              <strong>{c.split(': ')[0]}</strong>
              {c.split(':')[1]}
            </p>
          ))}
          <div ref={commentsRef} />
        </div>
        <div className="md:w-1/2">
          <h6 className="font-bold mb-2">Write a comment</h6>
          <textarea
            className="w-full border rounded py-2 px-3 mb-2"
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
      </div>
    </div>
  );
};

export default CommentSection;
