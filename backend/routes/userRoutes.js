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
  getOneUser,
  forgetPassword,
  resetPassword,
  resetPasswordFinish,
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
router.get('/get/:id', asyncHandler(getOneUser));
router
  .route('/profile')
  .get(asyncHandler(protect), asyncHandler(getUserProfile))
  .put(asyncHandler(protect), asyncHandler(updateUserProfile));
router.delete('/delete', asyncHandler(protect), asyncHandler(deleteUser));
router.post('/forget-password', asyncHandler(forgetPassword));
router
  .route('/reset-password/:id/:token')
  .get(asyncHandler(resetPassword))
  .post(asyncHandler(resetPasswordFinish));

// Export the module
export default router;

// asyncHandler(protect),
