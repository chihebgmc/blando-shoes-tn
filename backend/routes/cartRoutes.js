/*
 * cart router
 */

// Dependencies
import express from 'express';
import asyncHandler from 'express-async-handler';
import {
  addToCart,
  updateOneItem,
  deleteManyItems,
  deleteOneItem,
  getCartItems,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

// Initialize router
const router = express.Router();

// Define all cart routes
router
  .route('/')
  .post(protect, asyncHandler(addToCart))
  .get(protect, asyncHandler(getCartItems))
  .delete(protect, asyncHandler(deleteManyItems));
router
  .route('/:id')
  .put(protect, asyncHandler(updateOneItem))
  .delete(protect, asyncHandler(deleteOneItem));

// Export the module
export default router;
