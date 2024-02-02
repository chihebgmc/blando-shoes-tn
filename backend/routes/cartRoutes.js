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
  .post(asyncHandler(protect), asyncHandler(addToCart))
  .get(asyncHandler(protect), asyncHandler(getCartItems))
  .delete(asyncHandler(protect), asyncHandler(deleteManyItems));
router
  .route('/:id')
  .put(asyncHandler(protect), asyncHandler(updateOneItem))
  .delete(asyncHandler(protect), asyncHandler(deleteOneItem));

// Export the module
export default router;
