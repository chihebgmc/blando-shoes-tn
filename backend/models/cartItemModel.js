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
  price: { type: Number },
  quantity: { type: Number, min: 1, default: 1 },
  amount: { type: Number },
});

// Define the cart item model
const CartItem = mongoose.model('CartItem', cartItemSchema);

export const validate = (data, { update }) => {
  const schema = Joi.object({
    product: update ? Joi.string().min(24) : Joi.string().min(24).required(),
    size: update ? Joi.number() : Joi.number().required(),
    color: update ? Joi.string().min(3) : Joi.string().min(3).required(),
    quantity: update ? Joi.number().required() : Joi.number().default(1),
  });
  const result = schema.validate(data, { abortEarly: false });
  return result;
};

// Export the module
export default CartItem;
