// Dependencies
import mongoose from 'mongoose';
import { cartItemSchema } from './cartItemModel';

// Define the cart schema
const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [cartItemSchema],
});

// Define the cart model
const Cart = mongoose.model('Cart', cartSchema);

// Export the module
export default Cart;
