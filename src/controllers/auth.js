const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { Admin} = require('../models/Admin');
require('dotenv').config();

const register = async (req, res, next) => {
  const { username, email, password, role } = req.body;

  if(role === 'admin') {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = new Admin({ username, email, password: hashedPassword, role });
      await admin.save();
      res.json({ message: 'Registration successful' });
    } catch (error) {
      next(error);
    }
  } else {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword, role });
      await user.save();
      res.json({ message: 'Registration successful' });
    } catch (error) {
      next(error);
    }
  }
};
  
  const login = async (req, res, next) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const passwordMatch = await user.comparePassword(password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
      }
  
      const token = jwt.sign({ _id: user._id }, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.cThIIoDvwdueQB468K5xDc5633seEFoqwxjF_xSJyQQ');

  res.json({ token });
    } catch (error) {
      next(error);
    }
  };
  
  module.exports = { register, login };