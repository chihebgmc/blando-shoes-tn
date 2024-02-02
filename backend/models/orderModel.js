// Dependencies
import mongoose from 'mongoose';
import Joi from 'joi';
import { cartItemSchema } from './cartItemModel.js';

// Define the order schema
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['pending', 'fullfiled', 'rejected'],
      default: 'pending',
    },
    cart: {
      type: [cartItemSchema],
      default: [],
    },
    total: { type: Number, default: 0 },
    paymentType: { type: String, required: true },
  },
  { timestamps: true }
);

// Define the order model
const Order = mongoose.model('Order', orderSchema);

export const validate = data => {
  const schema = Joi.object({
    paymentType: Joi.string().required(),
  });
  const result = schema.validate(data, { abortEarly: false });
  return result;
};

// Export the module
export default Order;
