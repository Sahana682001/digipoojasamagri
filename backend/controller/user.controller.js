const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { sendResponseError } = require('../middleware/middleware');
const { checkPassword, newToken } = require('../utils/utility.function');

const signUpUser = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    // Validate input
    if (!email || !fullName || !password) {
      return sendResponseError(400, 'All fields are required', res);
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponseError(400, 'Email already in use', res);
    }

    // Hash password and create user
    const hash = await bcrypt.hash(password, 10); // Increased salt rounds for better security
    const user = await User.create({ ...req.body, password: hash });

    // Generate token and send response
    const token = newToken(user);
    return res.status(201).json({
      status: 'success',
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName
      }
    });

  } catch (err) {
    console.error('SignUp Error:', err);
    return sendResponseError(500, 'Something went wrong. Please try again.', res);
  }
};

const signInUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Validate input
    if (!email || !password) {
      return sendResponseError(400, 'Email and password are required', res);
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return sendResponseError(401, 'Invalid credentials', res); // Generic message for security
    }

    // Check password
    const isMatch = await checkPassword(password, user.password);
    if (!isMatch) {
      return sendResponseError(401, 'Invalid credentials', res);
    }

    // Generate token and send response
    const token = newToken(user);
    return res.status(200).json({
      status: 'success',
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName
      }
    });

  } catch (err) {
    console.error('SignIn Error:', err);
    return sendResponseError(500, 'Something went wrong. Please try again.', res);
  }
};

const getUser = async (req, res) => {
  try {
    // Return user info (without sensitive data)
    return res.status(200).json({
      user: {
        id: req.user._id,
        email: req.user.email,
        fullName: req.user.fullName
      }
    });
  } catch (err) {
    console.error('GetUser Error:', err);
    return sendResponseError(500, 'Failed to fetch user data', res);
  }
};

module.exports = { signUpUser, signInUser, getUser };