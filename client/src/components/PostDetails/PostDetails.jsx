import React, { useEffect } from 'react';
import { Paper, Typography, CircularProgress, Divider, Box, Link as MuiLink } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams, useNavigate, Link } from 'react-router-dom';

import { getPost, getPostsBySearch } from '../../actions/posts';
import CommentSection from './CommentSection';
import useStyles from './styles';

const Post = () => {
  const { post, posts, isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const styles = useStyles();
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
      <Paper elevation={6} sx={styles(theme => theme).loadingPaper}>
        <CircularProgress size="7em" />
      </Paper>
    );
  }

  const recommendedPosts = posts.filter(({ _id }) => _id !== post._id);

  return (
    <Paper sx={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
      <Box sx={styles(theme => theme).card}>
        <Box sx={styles(theme => theme).section}>
          <Typography variant="h3" component="h2">{post.title}</Typography>
          <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post.tags.map((tag) => (
            <MuiLink component={Link} to={`/tags/${tag}`} sx={{ textDecoration: 'none', color: '#3f51b5' }} key={tag}>
              {` #${tag} `}
            </MuiLink>
          ))}
          </Typography>
          <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
          <Typography variant="h6">
            Created by:
            <MuiLink component={Link} to={`/creators/${post.name}`} sx={{ textDecoration: 'none', color: '#3f51b5' }}>
              {` ${post.name}`}
            </MuiLink>
          </Typography>
          <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
          <Divider sx={{ margin: '20px 0' }} />
          <Typography variant="body1"><strong>Realtime Chat - coming soon!</strong></Typography>
          <Divider sx={{ margin: '20px 0' }} />
          <CommentSection post={post} />
          <Divider sx={{ margin: '20px 0' }} />
        </Box>
        <Box sx={styles(theme => theme).imageSection}>
          <img style={styles(theme => theme).media} src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={post.title} />
        </Box>
      </Box>
      {!!recommendedPosts.length && (
        <Box sx={styles(theme => theme).section}>
          <Typography gutterBottom variant="h5">You might also like:</Typography>
          <Divider />
          <Box sx={styles(theme => theme).recommendedPosts}>
            {recommendedPosts.map(({ title, name, message, likes, selectedFile, _id }) => (
              <Box sx={{ margin: '20px', cursor: 'pointer' }} onClick={() => openPost(_id)} key={_id}>
                <Typography gutterBottom variant="h6">{title}</Typography>
                <Typography gutterBottom variant="subtitle2">{name}</Typography>
                <Typography gutterBottom variant="subtitle2">{message}</Typography>
                <Typography gutterBottom variant="subtitle1">Likes: {likes.length}</Typography>
                <img src={selectedFile} width="200px" alt={title} />
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default Post;
