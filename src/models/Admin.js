
// const bcrypt = require('bcrypt');
// const User = require('../models/User');
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;


// require('dotenv').config();


// const AdminSchema = new Schema({
//     username: {
//         type: String,
//         unique: true,
//     },

//     password: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         unique: true,
//     },
//     isAdmin: {
//         type: Boolean,
//         default: false,
//     },
//     role: {
//         type: String,
//         enum: ['user', 'admin'],
//         default: 'admin',
//     },

// });

// AdminSchema.methods.comparePassword = function (password) {
//     return bcrypt.compare(password, this.password);
// };



// async function createAdminUser() {
//   const adminUser = await Admin.findOne({ username: 'admin' });
//   const saltRounds = 10;
//   const hashedPassword = await bcrypt.hash('admin123', saltRounds);
  
//   if (!adminUser) {
//     const admin = new Admin({
//       username: 'admin',
//       password: hashedPassword,
//       email: 'admin@example.com',
//       role: 'admin',
//     });
    
//     user.save()
//       .then(() => console.log('Admin user created'))
//       .catch(err => console.log('Error: ' + err));
//   }
// }


// const Admin = mongoose.model('Admin', AdminSchema);

// module.exports = { Admin, createAdminUser};



