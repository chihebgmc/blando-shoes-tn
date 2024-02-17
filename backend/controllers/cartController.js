import CartItem, { validate } from '../models/cartItemModel.js';
import Product from '../models/productModel.js';

const addToCart = async (req, res) => {
  const user = req.user;
  const { product, size, color, quantity } = req.body;
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { value, error } = validate(
    { product, size, color, quantity },
    { update: false }
  );
  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  const { price, reference, img } = await Product.findById(product);

  const item = user.cart.find(item => item.product.toString() === product);

  if (item) {
    item.amount = ++item.quantity * price;
  } else {
    const amount = value.quantity * price;
    const cartItem = new CartItem({
      product,
      reference,
      img,
      size,
      color,
      quantity,
      price,
      amount,
    });
    user.cart.push(cartItem);
  }

  res.status(201).json((await user.save()).cart);
};

const getCartItems = async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const total = user.cart.reduce(
    (accumulator, currentItem) => accumulator + currentItem.amount,
    0
  );
  res.json({ cart: user.cart, total });
};

const updateOneItem = async (req, res) => {
  const { quantity } = req.body;
  const { value, error } = validate({ quantity }, { update: true });
  if (error) {
    res.status(400);
    throw new Error(error.message);
  }
  const user = req.user;
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  const item = user.cart.id(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('cart item not found');
  }
  item.quantity = value.quantity;
  item.amount = item.price * value.quantity;
  res.json(await user.save());
};

const deleteOneItem = async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  const item = user.cart.id(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('cart item not found');
  }
  await item.deleteOne();
  res.json(await user.save());
};

const deleteManyItems = async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  for (const item of user.cart) {
    await CartItem.deleteOne({ _id: item });
  }
  user.cart = [];
  res.json(await user.save());
};

export {
  addToCart,
  getCartItems,
  updateOneItem,
  deleteManyItems,
  deleteOneItem,
};
