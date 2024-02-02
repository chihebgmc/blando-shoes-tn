import Order, { validate } from '../models/orderModel.js';
const createOrder = async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  const { paymentType } = req.body;
  const { error, value } = validate({ paymentType });
  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  if (user.cart.length === 0) {
    res.status(400);
    throw new Error('no cart items');
  }
  const total = user.cart.reduce(
    (accumulator, currentItem) => accumulator + currentItem.amount,
    0
  );
  const order = new Order({
    user: user._id,
    status: 'pending',
    cart: user.cart,
    total,
    paymentType: value.paymentType,
  });
  const result = await order.save();
  user.cart = [];
  await user.save();
  res.json(result);
};

export { createOrder };
