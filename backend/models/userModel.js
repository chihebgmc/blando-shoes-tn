// Dependencies
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Generate JWT token and save it in cookie
userSchema.methods.generateToken = function (res) {
  const token = jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

// Check if the password is valid
userSchema.methods.matchPassword = async function (enteredPassword) {
  enteredPassword =
    typeof enteredPassword !== 'undefined' ? enteredPassword : '';

  return await bcrypt.compare(enteredPassword, this.password);
};

// Define the user model
const User = mongoose.model('User', userSchema);

export const validate = (data, { update }) => {
  const schema = Joi.object({
    firstName: update ? Joi.string().min(3) : Joi.string().min(3).required(),
    lastName: update ? Joi.string().min(3) : Joi.string().min(3).required(),
    address: update ? Joi.string().min(3) : Joi.string().min(3).required(),
    email: update ? Joi.string().email() : Joi.string().email().required(),
    phone: update
      ? Joi.string().pattern(/[0-9]{2}-[0-9]{3}-[0-9]{3}/)
      : Joi.string()
          .pattern(/[0-9]{2}-[0-9]{3}-[0-9]{3}/)
          .required(),
    password: update ? Joi.string().min(8) : Joi.string().min(8).required(),
    role: Joi.string().valid('user', 'admin'),
  });
  const result = schema.validate(data, { abortEarly: false });
  return result;
};

// Export the module
export default User;
