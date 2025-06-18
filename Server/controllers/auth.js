import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// --- Helper: Generate JWT ---
const generateToken = (user) => {
  return jwt.sign(
    { user: { id: user._id, email: user.email } },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// --- SIGNUP Controller ---
export const signup = async (req, res) => {
  try {
    const { email, password, googleId, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists. Please log in.' });
    }

    let newUser;

    // --- Google Signup ---
    if (googleId) {
      newUser = new User({ email, googleId, name });
      await newUser.save();
    } 
    // --- Regular Signup ---
    else {
      if (!password || password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      newUser = new User({ email, password: hashedPassword, name });
      await newUser.save();
    }

    const token = generateToken(newUser);
    return res.status(201).json({ token, user: newUser });

  } catch (err) {
    console.error('Signup Error:', err);
    return res.status(500).json({ message: 'Internal server error during signup.' });
  }
};

// --- LOGIN Controller ---
export const login = async (req, res) => {
  try {
    const { email, password, googleId, name } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    let user = await User.findOne({ email });

    // --- Google Login Flow ---
    if (googleId) {
      // Register if not exists
      if (!user) {
        user = new User({ email, googleId, name });
        await user.save();
      } else if (!user.googleId) {
        // Add googleId to existing user
        user.googleId = googleId;
        await user.save();
      }

      const token = generateToken(user);
      return res.status(200).json({ token, user });
    }

    // --- Email/Password Login Flow ---
    if (!password) {
      return res.status(400).json({ message: 'Password is required.' });
    }

    if (!user) {
      return res.status(400).json({ message: 'No account found with this email.' });
    }

    // User registered via Google
    if (!user.password) {
      return res.status(400).json({ message: 'This account uses Google Sign-In. Please use Google login.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password. Please try again.' });
    }

    const token = generateToken(user);
    return res.status(200).json({ token, user });

  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ message: 'Internal server error during login.' });
  }
};
