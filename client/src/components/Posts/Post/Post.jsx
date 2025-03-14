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
  const [likes, setLikes] = useState([...(post?.likes || [])]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = user?.result.googleId || user?.result?._id;
  const hasLikedPost = post.likes?.includes(userId);

  const handleLike = async () => {
    //1.optimistic update (immediate ui change)
    const newLikes = [...likes]
    if (hasLikedPost) {
        const index = newLikes.findIndex((id) => id === userId);
        newLikes.splice(index, 1);
    } else {
      newLikes.push(userId);
    }
    setLikes(newLikes);

    //2. Send api request
    try {
      await dispatch(likePost(post._id));
    } catch (error) {
        //3. Rollback if API fails
      console.error("Error liking post:", error);
      setLikes([...(post.likes || [])]); // Revert to the original likes from the post data
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
    <div className="max-w-sm rounded-xl overflow-hidden border border-gray-300 shadow-lg">
      <div 
        role="button"
        tabIndex="0"
        className="block w-full relative cursor-pointer" 
        onClick={openPost}
        onKeyDown={(e) => e.key === 'Enter' && openPost()}
      >
        <img
          className="w-full h-full object-cover"
          src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'}
          alt={post.title}
        />
        <div className="overlay absolute left-0 top-0 size-full rounded-[10px]"></div>
        <div className="absolute top-0 left-0 m-2">
          <div className="text-white font-bold">{post.name}</div>
          <p className="text-white text-sm">{moment(post.createdAt).fromNow()}</p>
        </div>
        {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
          <div className="absolute top-0 right-0 m-2 " name="edit">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentId(post._id);
              }}
              className="text-gray-500 hover:text-gray-400 focus:outline-none"
            >
              <MoreHorizIcon fontSize="medium" />
            </button>
          </div>
        )}
        <div className="px-5 py-4">
          <div className="font-bold text-xl mb-2 text-[#09abcb]">{post.title.split(' ').splice(0, 10).join(' ')}...</div>
          <p className="text-gray-700 text-base">
            {post.message.split(' ').splice(0, 20).join(' ')}...
          </p>
        </div>
      </div>
      <div className="px-2 mt-4 mb-2">
        <button
          type="button"
          className="inline-block bg-[#f0911d21] rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-pointer"
          disabled={!user?.result}
          onClick={handleLike}
        >
          <Likes />
        </button>
        {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
          <button
            type="button"
            className="inline-block bg-[#f0911d21] rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-pointer"
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
