import express from 'express';
import mongoose from 'mongoose';

import PostMessage from '../models/post.model.js';

const router = express.Router();

export const getPosts = async (req, res) => {
  const { page } = req.query;
  
  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    
    const total = await PostMessage.countDocuments({});
    const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

    res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts. Please try again later.' });
  }
};

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;
  console.log(searchQuery, tags);

  try {
    const title = new RegExp(searchQuery, "i");

    const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});

    res.json({ data: posts });
  } catch (error) {
    res.status(500).json({ message: 'Failed to search posts. Please try again with different search terms.' });
  }
};

export const getPostsByCreator = async (req, res) => {
  const { name } = req.query;

  try {
    const posts = await PostMessage.find({ name });

    res.json({ data: posts });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts by creator. Please try again later.' });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Post not found. Invalid ID format.' });
    }
    
    const post = await PostMessage.findById(id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found. The post may have been deleted.' });
    }
    
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch the post. Please try again later.' });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;

  try {
    // Validate required fields
    if (!post.title || !post.message) {
      return res.status(400).json({ message: 'Title and message are required fields.' });
    }
    
    if (!post.selectedFile) {
      return res.status(400).json({ message: 'Please select an image for your post.' });
    }

    const newPostMessage = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });

    await newPostMessage.save();

    res.status(201).json(newPostMessage);
  } catch (error) {
    res.status(409).json({ message: 'Failed to create post. Please check your input and try again.' });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, message, creator, selectedFile, tags } = req.body;
  
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Post not found. Invalid ID format.' });
    }

    // Validate required fields
    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required fields.' });
    }

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update post. Please try again later.' });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Post not found. Invalid ID format.' });
    }

    const post = await PostMessage.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found. The post may have been deleted already.' });
    }

    await PostMessage.findByIdAndDelete(id);

    res.json({ message: 'Post deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post. Please try again later.' });
  }
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthenticated. Please sign in to like posts.' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Post not found. Invalid ID format.' });
    }
    
    const post = await PostMessage.findById(id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found. The post may have been deleted.' });
    }

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Failed to like post. Please try again later.' });
  }
};

export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthenticated. Please sign in to comment on posts.' });
    }
    
    if (!value || value.trim() === '') {
      return res.status(400).json({ message: 'Comment cannot be empty.' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Post not found. Invalid ID format.' });
    }
    
    const post = await PostMessage.findById(id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found. The post may have been deleted.' });
    }

    post.comments.push(value);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment. Please try again later.' });
  }
};

export default router;