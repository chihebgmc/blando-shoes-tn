/*
 * order router
 */

// Dependencies
import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/authMiddleware.js';
import {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrder,
} from '../controllers/orderController.js';
import { admin } from '../middleware/adminMiddleware.js';

// Initialize router
const router = express.Router();

// Define all order routes
router
  .route('/')
  .post(asyncHandler(protect), asyncHandler(createOrder))
  .get(asyncHandler(protect), asyncHandler(getAllOrders));

router
  .route('/:id')
  .get(asyncHandler(protect), asyncHandler(getOrder))
  .put(asyncHandler(protect), asyncHandler(admin), asyncHandler(updateOrder));

// Export the module
export default router;
