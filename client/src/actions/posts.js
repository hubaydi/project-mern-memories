import { START_LOADING, END_LOADING, FETCH_ALL, FETCH_POST, FETCH_BY_SEARCH, CREATE, UPDATE, DELETE, LIKE, COMMENT, FETCH_BY_CREATOR } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const getPost = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });

    const { data } = await api.fetchPost(id);

    dispatch({ type: FETCH_POST, payload: { post: data } });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.error('Error fetching post:', error);
    dispatch({ type: END_LOADING });
    throw error;
  }
};

export const getPosts = (page) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data: { data, currentPage, numberOfPages } } = await api.fetchPosts(page);

    dispatch({ type: FETCH_ALL, payload: { data, currentPage, numberOfPages } });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.error('Error fetching posts:', error);
    dispatch({ type: END_LOADING });
    throw error;
  }
};

export const getPostsByCreator = (name) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data: { data } } = await api.fetchPostsByCreator(name);
    console.log(data);

    dispatch({ type: FETCH_BY_CREATOR, payload: { data } });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.error('Error fetching posts by creator:', error);
    dispatch({ type: END_LOADING });
    throw error;
  }
};

export const getPostsBySearch = (searchQuery) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data: { data } } = await api.fetchPostsBySearch(searchQuery);

    dispatch({ type: FETCH_BY_SEARCH, payload: { data } });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.error('Error searching posts:', error);
    dispatch({ type: END_LOADING });
    throw error;
  }
};

export const createPost = (post, navigate) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.createPost(post);

    dispatch({ type: CREATE, payload: data });
    dispatch({ type: END_LOADING });

    navigate(`/posts/${data._id}`);
    return data;
  } catch (error) {
    console.error('Error creating post:', error);
    dispatch({ type: END_LOADING });
    throw error;
  }
};

export const updatePost = (id, post) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.updatePost(id, post);

    dispatch({ type: UPDATE, payload: data });
    dispatch({ type: END_LOADING });
    return data;
  } catch (error) {
    console.error('Error updating post:', error);
    dispatch({ type: END_LOADING });
    throw error;
  }
};

export const likePost = (id) => async (dispatch) => {
  const user = JSON.parse(localStorage.getItem('profile'));

  try {
    const { data } = await api.likePost(id, user?.token);

    dispatch({ type: LIKE, payload: data });
    return data;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

export const commentPost = (value, id) => async (dispatch) => {
  try {
    const { data } = await api.comment(value, id);

    dispatch({ type: COMMENT, payload: data });

    return data.comments;
  } catch (error) {
    console.error('Error commenting on post:', error);
    throw error;
  }
};

export const deletePost = (id) => async (dispatch) => {
  try {
    await api.deletePost(id);

    dispatch({ type: DELETE, payload: id });
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};
