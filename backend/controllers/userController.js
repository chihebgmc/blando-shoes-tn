// Dependencies
import jwt from 'jsonwebtoken';
import User, { validate } from '../models/userModel.js';
import Order from '../models/orderModel.js';
import nodemailer from 'nodemailer';

// @desc   Auth user/set token
// @route  POST /api/users/auth
// @access Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    user.generateToken(res);
    const result = user._doc;
    delete result.password;
    res.status(201).json(result);
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
};

// @desc   Register a new user
// @route  POST /api/users
// @access Public
const registerUser = async (req, res) => {
  const { name, email, password, phone, address, role } = req.body;

  // Validate data
  const { value, error } = validate(
    {
      name,
      email,
      password,
      phone,
      address,
      role,
    },
    { update: false }
  );

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  // check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create new user
  const user = await User.create(value);
  if (user) {
    // user.generateToken(res);
    res.status(201).json({ message: 'Account created successfuly' });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

// @desc   Get one user
// @route  GET /api/users/:id
// @access Public
const getOneUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.status(200).json(user);
};

// @desc   Logout user
// @route  POST /api/users/logout
// @access Public
const logoutUser = async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'User logged out' });
};

// @desc   Get user profile
// @route  GET /api/users/profile
// @access Private
const getUserProfile = async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  delete user._doc.cart;
  res.status(200).json(user._doc);
};

// @desc   Update user profile
// @route  PUT /api/users/profile
// @access Private
const updateUserProfile = async (req, res) => {
  if (req.user.role === 'admin') {
    var {
      name,
      email,
      password,
      oldPassword,
      phone,
      address,
      facebook,
      instagram,
      whatsapp,
      image,
      description,
    } = req.body;
  } else {
    var { name, email, password, oldPassword, phone, address } = req.body;
  }

  // Validate data
  const { value, error } = validate(
    {
      name,
      email,
      password,
      phone,
      address,
    },
    { update: true }
  );

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  if (!req.user) {
    res.status(404);
    throw new Error('User not found');
  }
  const user = await User.findById(req.user._id);

  // Update user
  if (password && !oldPassword) {
    throw new Error('Send old password');
  } else if (req.user.role === 'user') {
    user.name = value.name || user.name;
    user.email = value.email || user.email;
    user.address = value.address || user.address;
    user.phone = value.phone || user.phone;
    if (oldPassword) {
      // Check for old password
      console.log(user);
      const matched = await user.matchPassword(oldPassword);
      console.log(matched);
      if (!matched) {
        throw new Error('Password invalid');
      } else {
        user.password = value.password || user.password;
      }
    }
    const updatedUser = (await user.save())._doc;
    delete updatedUser.password;
    res.status(200).json(updatedUser);
  } else {
    user.name = value.name || user.name;
    user.email = value.email || user.email;
    user.address = value.address || user.address;
    user.phone = value.phone || user.phone;
    if (oldPassword) {
      // Check for old password
      console.log(user);
      const matched = await user.matchPassword(oldPassword);
      console.log(matched);
      if (!matched) {
        throw new Error('Password invalid');
      } else {
        user.password = value.password || user.password;
      }
    }
    user.facebook = facebook || user.facebook;
    user.instagram = instagram || user.instagram;
    user.whatsapp = whatsapp || user.whatsapp;
    user.image = image || user.image;
    user.description = description || user.description;
    const updatedUser = (await user.save())._doc;
    console.log(updatedUser);
    delete updatedUser.password;
    res.status(200).json(updatedUser);
  }
};

// @desc   Delete user
// @route  DELETE /api/users/delete
// @access Private
const deleteUser = async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Delete order related to a specific user
  await Order.deleteMany({ user: user.id });

  // Delete user
  const result = await user.deleteOne();

  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.send(result);
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  const oldUser = await User.findOne({ email });
  console.log(oldUser);
  if (!oldUser) {
    res.status(400);
    throw new Error('User not found.');
  }

  const secret = process.env.JWT_SECRET + oldUser.password;
  const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
    expiresIn: '5m',
  });
  const link = `http://localhost:5000/api/users/reset-password/${oldUser._id}/${token}`;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'chihebchaboudev@gmail.com',
      pass: 'chPWd4e5v21e5l12o15p16m13e5n14t20',
    },
  });

  const mailOptions = {
    from: 'youremail@gmail.com',
    to: 'chihebchabouparttime@gmail.com',
    subject: 'Password Reset',
    text: link,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  console.log(link);
  res.send('done');
};

const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    res.status(400);
    throw new Error('User not found.');
  }
  const secret = process.env.JWT_SECRET + oldUser.password;
  const { email } = jwt.verify(token, secret);
  res.json({ email, id });
};

const resetPasswordFinish = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  console.log(req.params);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    res.status(400);
    throw new Error('User not found.');
  }
  const secret = process.env.JWT_SECRET + oldUser.password;
  jwt.verify(token, secret);
  oldUser.password = password;
  await oldUser.save();

  res.json({ message: 'Password updated' });
};

// Export the module
export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getOneUser,
  forgetPassword,
  resetPassword,
  resetPasswordFinish,
};
