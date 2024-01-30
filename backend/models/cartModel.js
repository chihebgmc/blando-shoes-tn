// Dependencies
import mongoose from 'mongoose';
import { cartItemSchema } from './cartItemModel';

// Define the cart schema
const cartSchema = new mongoose.Schema({
  items: { type: [cartItemSchema], default: [] },
  total: Number,
});

// Define the cart model
const Cart = mongoose.model('Cart', cartSchema);

// Export the module
export default Cart;
