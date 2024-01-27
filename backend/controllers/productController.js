import Product from '../models/productModel.js';

const addProduct = async (req, res) => {
  res.send('Product added');
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
  res.send(`Product ${req.params.id} updated`);
};

const deleteProduct = async (req, res) => {
  res.send(`Product ${req.params.id} deleted`);
};

export { addProduct, getAllProducts, getProduct, updateProduct, deleteProduct };
