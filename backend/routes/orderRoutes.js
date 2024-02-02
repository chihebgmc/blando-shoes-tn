/*
 * order router
 */

// Dependencies
import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/authMiddleware.js';
import { createOrder } from '../controllers/orderController.js';

// Initialize router
const router = express.Router();

// Define all order routes
router.route('/').post(asyncHandler(protect), asyncHandler(createOrder));

// Export the module
export default router;
