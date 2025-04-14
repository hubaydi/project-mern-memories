import express from 'express';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

import auth from '../middleware/auth.middleware.js';

import {
  getProfile,
  updateProfile,
  uploadProfilePicture
} from '../controllers/profile.controller.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/users/'));
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    const uniqueSuffix = `profile-img-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`
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

// Profile routes
router.get('/:id', getProfile);
router.patch('/update/:id', auth, upload.single('profilePic'), updateProfile);
router.patch('/upload/:id', auth, upload.single('profilePic'), uploadProfilePicture);

export default router;
