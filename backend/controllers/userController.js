// Dependencies
import User, { validate } from '../models/userModel.js';
import Order from '../models/orderModel.js';

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
      phone,
      address,
      facebook,
      instagram,
      whatsapp,
      image,
      description,
    } = req.body;
  } else {
    var { name, email, password, phone, address } = req.body;
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

  // const user = await User.findById(req.user._id);

  // // Update user
  if (req.user.role === 'user') {
    const updatedUser = (
      await User.findByIdAndUpdate(req.user._id, value, {
        new: true,
      })
    )._doc;
    console.log(updatedUser);
    delete updatedUser.password;
    res.status(200).json(updatedUser);
  } else {
    const updatedUser = (
      await User.findByIdAndUpdate(
        req.user._id,
        { ...value, facebook, instagram, whatsapp, image, description },
        {
          new: true,
        }
      )
    )._doc;
    delete updatedUser.password;
    res.status(200).json(updatedUser);
  }
  // user.name = value.name || user.name;
  // user.email = value.email || user.email;
  // user.address = value.address || user.address;
  // user.phone = value.phone || user.phone;
  // user.password = value.password || user.password;
  // if (user.role === "admin") {
  //   user.facebook =
  // }
  // const updatedUser = (await user.save())._doc;
  // delete updatedUser.password;
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

// Export the module
export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
};
