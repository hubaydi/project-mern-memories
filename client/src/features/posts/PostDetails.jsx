import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPostsBySearch, selectAllPosts } from './postsSlice';
import CommentSection from '../../components/CommentSection';

const Post = () => {
  const { id } = useParams();
  const posts = useSelector(selectAllPosts);
  const post = useSelector(state => state.posts.posts.find(post => post._id === id));
  const isLoading = useSelector((state) => state.posts.status === 'loading');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (post?.tags?.length > 0) {
        const tags = post.tags.join(',');
        try {
          await dispatch(getPostsBySearch({ search: 'none', tags }))
        } catch (error) {
          console.error('Error fetching recommended posts:', error);
        }
      }
    };
    fetchData();
  }, [id]);

  const recommendedPosts = useMemo(() => {
    return posts.filter(({ _id }) => _id !== post?._id);
  }, [posts, post?._id]);

  if (!post) return null;

  const imageUrl = post.selectedFile
  ? post.selectedFile.startsWith('http')
    ? post.selectedFile
    : 'http://localhost:5000' + post.selectedFile
  : 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png';

  const openPost = (_id) => navigate(`/posts/${_id}`);

  if (isLoading) {
    return (
      <div className="rounded-lg shadow-md p-6 flex justify-center">
        <div
          className="w-28 h-28 border-4 border-gray-200 rounded-full border-t-blue-500 animate-spin"
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex flex-col gap-4 max-w-3xl mx-auto">
        <div className="">
          <h2 className="text-lg font-bold mb-2 text-[#09abcb]">{post.title}</h2>
          <div className="flex justify-between items-center mt-4">
            <h6 className="font-semibold text-gray-400 text-sm">
              Created by:
              <Link to={`/creators/${post.name}`} className="text-[#09abcb] hover:underline ml-1">
                {post.name}
              </Link>
            </h6>
            <p className="text-gray-500 text-sm">{moment(post.createdAt).fromNow()}</p>
          </div>
          <div className="my-6 flex justify-center">
            <img
              className="w-full h-full object-cover"
              src={imageUrl}
              alt={post.title}
            />
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {post.tags?.map((tag) => (
              <Link to={`/tags/${tag}`} className="text-[#09abcb] hover:underline text-sm" key={tag}>
                {`#${tag}`}
              </Link>
            ))}
          </div>
          <p className="text-gray-700 leading-relaxed">{post.message}</p>
          <hr className="my-5 border-gray-200" />
          {/* <p className="text-gray-700 font-semibold">Realtime Chat - coming soon!</p> */}
          {/* <hr className="my-5 border-gray-200" /> */}
          <div className="mt-4">
            <CommentSection postId={post._id} />
          </div>
          <hr className="my-5 border-gray-200" />
        </div>
      </div>
      {recommendedPosts.length > 0 && (
        <div className="mt-8">
          <h5 className="text-lg font-bold mb-3">You might also like:</h5>
          <hr className="border-gray-200 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedPosts.map(({ title, name, message, likes, selectedFile, _id }) => (
              <div
                className="rounded-md shadow-sm hover:shadow-md transition duration-300 cursor-pointer p-3"
                onClick={() => openPost(_id)}
                key={_id}
              >
                <h6 className="text-md font-bold">{title}</h6>
                <p className="text-sm text-gray-600">{name}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{message}</p>
                <p className="text-sm">Likes: {likes?.length}</p>
                <img src={selectedFile} alt={title} className="rounded-md w-full object-cover aspect-square mt-2" style={{height: '120px'}} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
