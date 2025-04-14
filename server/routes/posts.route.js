import express from 'express';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

import { 
  getPosts, 
  getPostsBySearch, 
  getPostsByCreator, 
  getPost, 
  createPost, 
  updatePost, likePost, commentPost, deletePost } from '../controllers/posts.controller.js';

import auth from "../middleware/auth.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/posts/'));
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    const uniqueSuffix = `post-img-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`
    cb(null, uniqueSuffix)
  }
});

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split('/')[0] === 'image';

  if (imageType) {
    return cb(null, true);
  } else {
    return cb(null, false);
  }
}

const upload = multer({ storage: storage, fileFilter })

router.route('/')
  .get(getPosts)
  .post(auth, upload.single('selectedFile'), createPost);

router.route('/:id')
  .get(getPost)
  .patch(auth, upload.single('selectedFile'), updatePost)
  .delete(auth, deletePost);
  
router.patch('/:id/like-post', auth, likePost);
router.post('/:id/comment-post', auth, commentPost);
  
router.get('/creator', getPostsByCreator);
router.get('/search', getPostsBySearch);

export default router;