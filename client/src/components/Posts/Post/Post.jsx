import React, { useState } from 'react';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ThumbUpAltOutlined from '@mui/icons-material/ThumbUpAltOutlined';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

import { likePost, deletePost } from '../../../actions/posts';

const Post = ({ post, setCurrentId }) => {
  const user = JSON.parse(localStorage.getItem('profile'));
  const [likes, setLikes] = useState(post?.likes);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = user?.result.googleId || user?.result?._id;
  const hasLikedPost = post.likes.find((like) => like === userId);

  const handleLike = async () => {
    dispatch(likePost(post._id));

    if (hasLikedPost) {
      setLikes(post.likes.filter((id) => id !== userId));
    } else {
      setLikes([...post.likes, userId]);
    }
  };

  const Likes = () => {
    if (likes.length > 0) {
      return likes.find((like) => like === userId)
        ? (
          <>
            <ThumbUpAltIcon fontSize="small" />
            &nbsp;
            {likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}`}
          </>
        ) : (
          <>
            <ThumbUpAltOutlined fontSize="small" />
            &nbsp;
            {likes.length} {likes.length === 1 ? 'Like' : 'Likes'}
          </>
        );
    }

    return (
      <>
        <ThumbUpAltOutlined fontSize="small" />
        &nbsp;Like
      </>
    );
  };

  const openPost = (e) => {
    navigate(`/posts/${post._id}`);
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <div 
        role="button"
        tabIndex="0"
        className="block h-48 w-full relative cursor-pointer" 
        onClick={openPost}
        onKeyDown={(e) => e.key === 'Enter' && openPost()}
      >
        <img
          className="w-full h-full object-cover"
          src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'}
          alt={post.title}
        />
        <div className="absolute top-0 left-0 m-2">
          <div className="text-white font-bold text-xl">{post.name}</div>
          <p className="text-white text-sm">{moment(post.createdAt).fromNow()}</p>
        </div>
        {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
          <div className="absolute top-0 right-0 m-2" name="edit">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentId(post._id);
              }}
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              <MoreHorizIcon fontSize="medium" />
            </button>
          </div>
        )}
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{post.title}</div>
          <p className="text-gray-700 text-base">
            {post.message.split(' ').splice(0, 20).join(' ')}...
          </p>
        </div>
      </div>
      <div className="px-6 pt-4 pb-2">
        <button
          type="button"
          className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          disabled={!user?.result}
          onClick={handleLike}
        >
          <Likes />
        </button>
        {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
          <button
            type="button"
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
            onClick={() => dispatch(deletePost(post._id))}
          >
            <DeleteIcon fontSize="small" />
            &nbsp; Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default Post;
