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

// Initialize router
const router = express.Router();

router
  .route('/')
  .post(asyncHandler(addProduct))
  .get(asyncHandler(getAllProducts));

router
  .route('/:id')
  .get(asyncHandler(getProduct))
  .put(asyncHandler(updateProduct))
  .delete(asyncHandler(deleteProduct));

// Export the module
export default router;
