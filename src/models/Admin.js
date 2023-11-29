
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


require('dotenv').config();


const AdminSchema = new Schema({
    username: {
        type: String,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'admin',
    },

});

AdminSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};
const Admin = mongoose.model('Admin', AdminSchema);




async function createAdminUser() {
  const adminUser = await Admin.findOne({ username: 'admin' });
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash('admin123', saltRounds);
  
  if (!adminUser) {
    const admin = new Admin({
      username: 'admin',
      password: hashedPassword,
      email: 'admin@example.com',
      role: 'admin',
    });
    
    admin.save()
      .then(() => console.log('Admin user created'))
      .catch(err => console.log('Error: ' + err));
  }
}

const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'User is not an admin' });
    }
  };
  




module.exports = { Admin, createAdminUser, verifyAdmin };



