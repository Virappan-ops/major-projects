const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/users/register
const registerUser = async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please enter all fields');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Failed to create user" });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      
      // --- YE LINE MISSING HOGI, ISE ADD KARO ---
      isPremium: user.isPremium, 
      // ----------------------------------------
      
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid Email or Password" });
  }
};

// @desc    Auth with Google
// @route   POST /api/users/google
const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    // 1. Verify Token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    // 2. Get User Info from Token
    const { name, email, picture } = ticket.getPayload();

    // 3. Check if user exists in our DB
    let user = await User.findOne({ email });

    if (user) {
      // User exists -> Log them in
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        isPremium: user.isPremium,
        token: generateToken(user._id),
      });
    } else {
      // User doesn't exist -> Create them
      // We create a random password since they use Google
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

      user = await User.create({
        name,
        email,
        password: randomPassword, 
        pic: picture,
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        isPremium: user.isPremium,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(400).json({ message: "Google verification failed" });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.pic = req.body.pic || user.pic; // <--- ADD THIS LINE TO SAVE PIC
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      pic: updatedUser.pic, // Return new pic
      isPremium: updatedUser.isPremium,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Upgrade user to premium
// @route   PUT /api/users/premium
const upgradeToPremium = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.isPremium = true; // <--- The Golden Switch
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      pic: updatedUser.pic,
      isPremium: updatedUser.isPremium, // Return new status
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

module.exports = { registerUser, loginUser, googleLogin, updateUserProfile, upgradeToPremium };