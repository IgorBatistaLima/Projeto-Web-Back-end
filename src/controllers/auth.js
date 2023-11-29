const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const {Admin} = require('../models/Admin');
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
    // Buscar o usuário (ou admin) pelo nome de usuário
    const user = await User.findOne({ username }) || await Admin.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Comparar a senha fornecida com a senha armazenada
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Verificar se o usuário é um administrador
    if (user.role === 'admin') {
      console.log('User is an admin');
    } else {
      console.log('User is not an admin');
    }


    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};
  
  module.exports = { register, login };