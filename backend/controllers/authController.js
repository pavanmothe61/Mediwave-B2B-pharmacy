const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_internship_key';

exports.register = async (req, res) => {
  try {
    const { email, password, role, address, name } = req.body;
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password_hash, role: role || 'pharmacy', address, name });

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ message: 'Login successful', token, user: { id: user.id, email: user.email, role: user.role, address: user.address, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

exports.getUserCount = async (req, res) => {
  try {
    const count = await User.count();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user count' });
  }
};
