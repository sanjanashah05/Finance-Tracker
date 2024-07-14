const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../Models/User');
require('dotenv').config();

// Mail sending module
const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Register
router.post('/register', async (req, res) => {
  const { name, su_email, su_password } = req.body;

  // Check if username is provided
  if (!name) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    console.log('Registering user:', req.body);

    let user = await User.findOne({ email: su_email });
    if (user) {
      console.log('Email already registered:', su_email);
      return res.status(400).json({ message: 'Email already registered' });
    }

    user = await User.findOne({ username: name });
    if (user) {
      console.log('Username already exists:', name);
      return res.status(400).json({ message: 'Username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(su_password, salt);

    user = new User({
      username: name,
      email: su_email,
      password: hashedPassword,
    });

    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: su_email,
      subject: 'Welcome to Our Website!',
      text: `Hello ${name},\n\nThank you for signing up on our website.\nhumari website boht khatarnak he\n\nBest Regards,\nCapitalCompass`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send('Error sending confirmation email');
      } else {
        console.log('Email sent:', info.response);
        return res.status(200).send('Signup successful and email sent');
      }
    });

    console.log('User registered successfully:', user);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Logging in user:', req.body);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('Invalid credentials - User not found:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid credentials - Password mismatch:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error('Error signing token:', err);
          throw err;
        }
        res.json({ token: token });
      }
    );
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;