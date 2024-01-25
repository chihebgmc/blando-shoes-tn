/*
 * user router
 */

// Dependencies
import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import asyncHandler from 'express-async-handler';

// Initialize router
const router = express.Router();

// Define all user's routes
router.post('/', asyncHandler(registerUser));
router.post('/auth', asyncHandler(authUser));
router.post('/logout', asyncHandler(logoutUser));
router
  .route('/profile')
  .get(asyncHandler(protect), asyncHandler(getUserProfile))
  .put(asyncHandler(protect), asyncHandler(updateUserProfile));

export default router;

// asyncHandler(protect),
