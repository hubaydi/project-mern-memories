import express from 'express';
import multer from 'multer';

import auth from '../middleware/auth.middleware.js';
import { getProfile, updateProfile, uploadProfilePicture } from '../controllers/profile.controller.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile-pictures/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Profile routes
router.get('/:id', getProfile);
router.patch('/:id', auth, updateProfile);
router.post('/:id/upload', auth, upload.single('file'), uploadProfilePicture);

export default router;
