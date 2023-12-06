const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {User} = require('../models/User');
require('dotenv').config();

const register = async (req, res, next) => {
  const { username, email, password, role } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword, role });
      await user.save();
      res.json({ message: 'Registration successful' });
    } catch (error) {
      next(error);
    }
  };
  
const login = async (req, res, next) => {
  const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
      }
  
      const payload = { _id: user._id, role: user.role };
      const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' });
  
      res.json({ token });
    } catch (error) {
      next(error);
    }
  };
  


  
  module.exports = { register, login };