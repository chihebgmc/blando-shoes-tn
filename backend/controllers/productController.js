import Product, { validate } from '../models/productModel.js';

const addProduct = async (req, res) => {
  // Check if user exists
  const user = req.user;
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Get the data from request body
  const { reference, img, categories, size, color, price, inStock } = req.body;

  // Validate data
  const { value, error } = validate(
    { reference, img, categories, size, color, price, inStock },
    { update: false }
  );

  // Check if error exists
  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  // Check if product already exists
  const productExist = await Product.findOne({ reference });
  if (productExist) {
    res.status(400);
    throw new Error('Product already exists');
  }

  // Create product
  const product = await Product.create({ ...value, user: user._id });
  if (product) {
    res.status(201).json({ message: 'Product added successfuly' });
  } else {
    res.status(400);
    throw new Error('Invalid data');
  }
};

const getAllProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
};

const updateProduct = async (req, res) => {
  // Check if user exists
  const user = req.user;
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Get the data from request body
  const { reference, img, categories, size, color, price, inStock } = req.body;

  // Validate data
  const { value, error } = validate(
    { reference, img, categories, size, color, price, inStock },
    { update: true }
  );

  // Check if error exists
  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  // Update product
  const product = await Product.findByIdAndUpdate(req.params.id, value, {
    new: true,
  });

  // Check if product exists
  if (!product) {
    res.status(404);
    throw new Error('product not found');
  }

  res.status(200).json(product);
};

const deleteProduct = async (req, res) => {
  // Check if user exists
  const user = req.user;
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Delete Product
  const product = await Product.findByIdAndDelete(req.params.id);

  // Check if product exists
  if (!product) {
    res.status(404);
    throw new Error('product not found');
  }

  res.status(201).json({ _id: product._id });
};

export { addProduct, getAllProducts, getProduct, updateProduct, deleteProduct };
