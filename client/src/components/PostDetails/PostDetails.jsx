import React, { useEffect } from 'react';
// import { Paper, Typography, CircularProgress, Divider, Box, Link as MuiLink } from '@mui/material'; // Remove MUI imports
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams, useNavigate, Link } from 'react-router-dom';

import { getPost, getPostsBySearch } from '../../actions/posts';
import CommentSection from './CommentSection';
// import useStyles from './styles'; // Remove useStyles

const Post = () => {
  const { post, posts, isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const styles = useStyles(); // Remove useStyles
  const { id } = useParams();

  useEffect(() => {
    dispatch(getPost(id));
  }, [id]);

  useEffect(() => {
    if (post) {
      dispatch(getPostsBySearch({ search: 'none', tags: post?.tags.join(',') }));
    }
  }, [post]);

  if (!post) return null;

  const openPost = (_id) => navigate(`/posts/${_id}`);

  if (isLoading) {
    return (
      <div className="rounded-lg shadow-md p-6 flex justify-center"> {/* Replace Paper with div and add Tailwind classes */}
        <CircularProgress size="7em" />
      </div>
    );
  }

  const recommendedPosts = posts.filter(({ _id }) => _id !== post._id);

  return (
    <div className="bg-white rounded-lg shadow-md p-6"> {/* Replace Paper with div and add Tailwind classes */}
      <div className="flex flex-col md:flex-row"> {/* Replace Card with div and add Tailwind classes */}
        <div className="md:w-2/3"> {/* Replace section with div and add Tailwind classes */}
          <h2 className="text-2xl font-bold mb-2">{post.title}</h2> {/* Replace Typography with h2 and add Tailwind classes */}
          <div className="mb-2"> {/* Replace Typography with div and add Tailwind classes */}
            {post.tags.map((tag) => (
              <Link to={`/tags/${tag}`} className="text-blue-500 hover:underline mr-2" key={tag}> {/* Replace MuiLink with Link and add Tailwind classes */}
                {` #${tag} `}
              </Link>
            ))}
          </div>
          <p className="text-gray-700 mb-4">{post.message}</p> {/* Replace Typography with p and add Tailwind classes */}
          <h6 className="font-bold"> {/* Replace Typography with h6 and add Tailwind classes */}
            Created by:
            <Link to={`/creators/${post.name}`} className="text-blue-500 hover:underline"> {/* Replace MuiLink with Link and add Tailwind classes */}
              {` ${post.name}`}
            </Link>
          </h6>
          <p className="text-gray-500">{moment(post.createdAt).fromNow()}</p> {/* Replace Typography with p and add Tailwind classes */}
          <hr className="my-4" /> {/* Replace Divider with hr and add Tailwind classes */}
          <p className="text-gray-700"><strong>Realtime Chat - coming soon!</strong></p> {/* Replace Typography with p and add Tailwind classes */}
          <hr className="my-4" /> {/* Replace Divider with hr and add Tailwind classes */}
          <CommentSection post={post} />
          <hr className="my-4" /> {/* Replace Divider with hr and add Tailwind classes */}
        </div>
        <div className="md:w-1/3"> {/* Replace imageSection with div and add Tailwind classes */}
          <img className="w-full rounded-md" src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={post.title} />
        </div>
      </div>
      {!!recommendedPosts.length && (
        <div className="mt-6"> {/* Replace section with div and add Tailwind classes */}
          <h5 className="text-lg font-bold mb-2">You might also like:</h5> {/* Replace Typography with h5 and add Tailwind classes */}
          <hr /> {/* Replace Divider with hr and add Tailwind classes */}
          <div className="flex flex-wrap"> {/* Replace recommendedPosts with div and add Tailwind classes */}
            {recommendedPosts.map(({ title, name, message, likes, selectedFile, _id }) => (
              <div className="w-full md:w-1/2 lg:w-1/3 p-2 cursor-pointer" onClick={() => openPost(_id)} key={_id}> {/* Replace Box with div and add Tailwind classes */}
                <h6 className="text-md font-bold">{title}</h6> {/* Replace Typography with h6 and add Tailwind classes */}
                <p className="text-sm text-gray-600">{name}</p> {/* Replace Typography with p and add Tailwind classes */}
                <p className="text-sm text-gray-600">{message}</p> {/* Replace Typography with p and add Tailwind classes */}
                <p className="text-sm">Likes: {likes.length}</p> {/* Replace Typography with p and add Tailwind classes */}
                <img src={selectedFile} width="200px" alt={title} className="rounded-md" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
