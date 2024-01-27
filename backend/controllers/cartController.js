import CartItem from '../models/cartItemModel.js';

const addToCart = async (req, res) => {
  const user = req.user;
  const { product, quantity } = req.body;
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  const item = user.cart.find(item => item.product.toString() === product);

  if (item) {
    item.quantity++;
  } else {
    const cartItem = new CartItem({ product, quantity });
    user.cart.push(cartItem);
  }

  res.status(201).json(await user.save());
};

const getCartItems = async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user.cart);
};

const updateOneItem = async (req, res) => {
  const { quantity } = req.body;
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
  item.quantity = quantity;
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
