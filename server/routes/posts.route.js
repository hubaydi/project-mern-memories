import express from 'express';

import { 
  getPosts, 
  getPostsBySearch, 
  getPostsByCreator, 
  getPost, 
  createPost, 
  updatePost, likePost, commentPost, deletePost } from '../controllers/posts.controller.js';

const router = express.Router();
import auth from "../middleware/auth.middleware.js";

router.route('/')
  .get(getPosts)
  .post(auth, createPost);

router.route('/:id')
  .get(getPost)
  .patch(auth, updatePost)
  .delete(auth, deletePost);
  
router.patch('/:id/like-post', auth, likePost);
router.post('/:id/comment-post', auth, commentPost);
  
router.get('/creator', getPostsByCreator);
router.get('/search', getPostsBySearch);

export default router;