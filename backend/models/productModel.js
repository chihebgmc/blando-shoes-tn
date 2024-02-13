// Dependencies
import mongoose from 'mongoose';
import Joi from 'joi';

// Define the product schema
const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reference: { type: String, required: true },
  img: { type: String, required: true },
  categories: { type: [String], required: true },
  size: { type: [Number], required: true },
  color: { type: [String], required: true },
  price: { type: Number, required: true },
  inStock: { type: Boolean, default: true },
});

// Define the product model
const Product = mongoose.model('Product', productSchema);

export const validate = (data, { update }) => {
  const schema = Joi.object({
    reference: update ? Joi.string() : Joi.string().required(),
    img: update ? Joi.string() : Joi.string().required(),
    categories: update
      ? Joi.array().items(Joi.string())
      : Joi.array().items(Joi.string()).required(),
    size: update
      ? Joi.array().items(Joi.number())
      : Joi.array().items(Joi.number()).required(),
    color: update
      ? Joi.array().items(Joi.string())
      : Joi.array().items(Joi.string()).required(),
    price: update ? Joi.number() : Joi.number().required(1),
    inStock: update ? Joi.boolean() : Joi.boolean().default(true),
  });
  const result = schema.validate(data, { abortEarly: false });
  return result;
};

// Export the module
export default Product;

// const products = [
//   {
//     reference: '208',
//     img: 'https://scontent.ftun1-2.fna.fbcdn.net/v/t39.30808-6/417475919_372422288751584_9192820056419364448_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=dd5e9f&_nc_ohc=VWOFDJew9fMAX-Xy3lA&_nc_ht=scontent.ftun1-2.fna&oh=00_AfD4Ra_uMuARwDZI0llt6mt0LKE9SLo4tCSvdoE8ds6-eA&oe=65B7F83C',
//     categories: 'men',
//     size: [38, 39, 40, 41, 42, 43, 44],
//     color: ['redblue'],
//     price: 53,
//     inStock: true,
//   },
//   {
//     reference: '040',
//     img: 'https://scontent.ftun1-2.fna.fbcdn.net/v/t39.30808-6/414479343_357067603620386_3910275474088599347_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=dd5e9f&_nc_ohc=cB9FFMlkDBcAX_5X2Ou&_nc_ht=scontent.ftun1-2.fna&oh=00_AfB3yzqnr8UsM6FZuB-5t0kNL81bTOhhFcx7KB5GWf9yiw&oe=65B916EC',
//     categories: 'men',
//     size: [38, 39, 40, 41, 42, 43, 44],
//     color: ['redblue'],
//     price: 53,
//     inStock: true,
//   },
//   {
//     reference: '015',
//     img: 'https://scontent.ftun1-2.fna.fbcdn.net/v/t39.30808-6/414447770_357067783620368_398286983465111873_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=dd5e9f&_nc_ohc=48LyRY1f2bMAX_4Mccj&_nc_ht=scontent.ftun1-2.fna&oh=00_AfDKkJjQcVCAvq5iDeOdPMY8rhcHnREgk6ZYYBulSsBRyg&oe=65B8E256',
//     categories: 'men',
//     size: [38, 39, 40, 41, 42, 43, 44],
//     color: ['redblue'],
//     price: 53,
//     inStock: true,
//   },
//   {
//     reference: '107',
//     img: 'https://scontent.ftun1-2.fna.fbcdn.net/v/t39.30808-6/414480393_357067103620436_3507494404650549531_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=dd5e9f&_nc_ohc=w4p3aB-ZyDMAX8180A8&_nc_ht=scontent.ftun1-2.fna&oh=00_AfBHFbmjvorbJK_Pxu52uFJ2QP0lALLDMH1XY28_bMmAeQ&oe=65B9936E',
//     categories: 'men',
//     size: [38, 39, 40, 41, 42, 43, 44],
//     color: ['redblue'],
//     price: 58,
//     inStock: true,
//   },
// ];
