// Dependencies
import mongoose from 'mongoose';

// Define the order schema
const orderSchema = new mongoose.Schema();

// Define the order model
const Order = mongoose.model('Order', orderSchema);

// Export the module
export default Order;
