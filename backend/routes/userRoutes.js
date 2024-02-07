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
  deleteUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import asyncHandler from 'express-async-handler';
import { admin } from '../middleware/adminMiddleware.js';

// Initialize router
const router = express.Router();

// Define all user's routes
router.post('/register', asyncHandler(registerUser));
router.post('/auth', asyncHandler(authUser));
router.post('/logout', asyncHandler(logoutUser));
router
  .route('/profile')
  .get(asyncHandler(protect), asyncHandler(getUserProfile))
  .put(asyncHandler(protect), asyncHandler(updateUserProfile));
router.delete('/delete', asyncHandler(protect), asyncHandler(deleteUser));

// Export the module
export default router;

// asyncHandler(protect),
