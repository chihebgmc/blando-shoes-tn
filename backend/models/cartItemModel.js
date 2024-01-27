// Dependencies
import mongoose from 'mongoose';

// Define the cart item schema
export const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, min: 1, default: 1 },
});

// Define the cart item model
const CartItem = mongoose.model('CartItem', cartItemSchema);

// Export the module
export default CartItem;
