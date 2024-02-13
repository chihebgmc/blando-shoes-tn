/*
 * product router
 */

// Dependencies
import express from 'express';
import asyncHandler from 'express-async-handler';
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

// Initialize router
const router = express.Router();

router
  .route('/')
  .post(asyncHandler(protect), asyncHandler(admin), asyncHandler(addProduct))
  .get(
    // asyncHandler(protect),
    // asyncHandler(admin),
    asyncHandler(getAllProducts)
  );

router
  .route('/:id')
  .get(asyncHandler(getProduct))
  .put(asyncHandler(protect), asyncHandler(admin), asyncHandler(updateProduct))
  .delete(
    asyncHandler(protect),
    asyncHandler(admin),
    asyncHandler(deleteProduct)
  );

// Export the module
export default router;
