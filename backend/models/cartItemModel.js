// Dependencies
import mongoose from 'mongoose';
import Joi from 'joi';

// Define the cart item schema
export const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  reference: { type: String, required: true },
  img: { type: String, required: true },
  size: { type: Number, required: true },
  color: { type: String, required: true },
  quantity: { type: Number, min: 1, default: 1 },
  amount: { type: Number },
});

// Define the cart item model
const CartItem = mongoose.model('CartItem', cartItemSchema);

export const validate = data => {
  const schema = Joi.object({
    product: Joi.string().min(24).required(),
    size: Joi.number().required(),
    color: Joi.string().min(3).required(),
    quantity: Joi.number().default(1),
    amount: Joi.number(),
  });
  const result = schema.validate(data, { abortEarly: false });
  return result;
};

// Export the module
export default CartItem;
