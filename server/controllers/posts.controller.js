import mongoose from 'mongoose';

import PostModel from '../models/post.model.js';

import { SUCCESS, FAIL } from '../utils/constants.js';
import appError from '../utils/appError.js';

export const getPosts = async (req, res, next) => {
  const { page } = req.query;
  
  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT; 
    
    const total = await PostModel.countDocuments({});
    const posts = await PostModel.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

    res.status(200).json({ status: SUCCESS, data: { posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts. Please try again later.' });
  }
};

export const getPostsBySearch = async (req, res, next) => {
  console.log("from getPostsBySearch", req.query);
  const { searchQuery, tags } = req.query;

  if (!searchQuery && !tags) {
    const error = appError.create('No search query or tags provided.', 400, FAIL);
    return next(error);
  }


  try {
    const title = new RegExp(searchQuery, "i");

    const posts = await PostModel.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});

    res.status(200).json({ status: SUCCESS, data: { posts } });
  } catch (error) {
    res.status(500).json({ status: FAIL, message: 'Failed to search posts. Please try again with different search terms.', error: error.message });
  }
};

export const getPostsByCreator = async (req, res, next) => {
  const { name } = req.query;

  try {
    const posts = await PostModel.find({ name });

    res.status(200).json({ status: SUCCESS, data: { posts } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts by creator. Please try again later.' });
  }
};

export const getPost = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = appError.create('Post not found. Invalid ID format.', 400, FAIL);
      return next(error);
    }
    
    const post = await PostModel.findById(id);
    
    if (!post) {
      const error = appError.create('Post not found. The post may have been deleted.', 404, FAIL);
      return next(error);
    }
    
    res.status(200).json({ status: SUCCESS, data: { post } });
  } catch (error) {
    res.status(500).json({status: FAIL, message: 'Failed to fetch the post. Please try again later.', error: error.message });
  }
};

export const createPost = async (req, res, next) => {

  const post = req.body;

  try {
    
    if (!req.file) {
      const error = appError.create('Image file is required.', 400, FAIL);
      return next(error);
    }

    const newPost = new PostModel({ ...post, creator: req.userId, selectedFile: `/uploads/posts/${req.file.filename}` , createdAt: new Date().toISOString() });

    await newPost.save();

    res.status(201).json({ status: SUCCESS, data: { post: newPost } });
  } catch (error) {
    res.status(409).json({ message: 'Failed to create post. Please check your input and try again.' });
  }
};

export const updatePost = async (req, res, next) => {
  const { id } = req.params;
  const updatedPpost = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = appError.create('Post not found. Invalid ID format.', 400, FAIL);
      return next(error);
    }

    let updateData = { ...updatedPpost };

    if (req.file) {
      updateData.selectedFile = `/uploads/posts/${req.file.filename}`;
    }

    const post = await PostModel.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json({ status: SUCCESS, data: { post } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update post. Please try again later.', error });
  }
};

export const deletePost = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = appError.create('Post not found. Invalid ID format.', 400, FAIL);
      return next(error);
    }

    const post = await PostModel.findById(id);
    if (!post) {
      const error = appError.create('Post not found. The post may have been deleted.', 404, FAIL);
      return next(error);
    }

    await PostModel.findByIdAndDelete(id);

    res.status(200).json({status: SUCCESS, data: { id }, message: 'Post deleted successfully.'});
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post. Please try again later.' });
  }
};

export const likePost = async (req, res, next) => {
  const { id } = req.params;

  try {
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = appError.create('Post not found. Invalid ID format.', 400, FAIL);
      return next(error);
      }
    
    const post = await PostModel.findById(id);
    
    if (!post) {
      const error = appError.create('Post not found. The post may have been deleted.', 404, FAIL);
      return next(error);
    }

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    
    const updatedPost = await PostModel.findByIdAndUpdate(id, post, { new: true });
    
    res.status(200).json({ status: SUCCESS, data: { post: updatedPost } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to like post. Please try again later.' });
  }
};

export const commentPost = async (req, res, next) => {
  const { id } = req.params;
  const { value } = req.body;

  try {
    
    if (!value || value.trim() === '') {
      const error = appError.create('Comment can not be empty.', 400, FAIL);
      return next(error);
    }
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = appError.create('Post not found. Invalid ID format.', 400, FAIL);
      return next(error);
    }
    
    const post = await PostModel.findById(id);
    
    if (!post) {
      const error = appError.create('Post not found. The post may have been deleted.', 404, FAIL);
      return next(error);
    }

    post.comments.push(value);

    const updatedPost = await PostModel.findByIdAndUpdate(id, post, { new: true });

    res.json({ status: SUCCESS, data: { post: updatedPost } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment. Please try again later.' });
  }
};