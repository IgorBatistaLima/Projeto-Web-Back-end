const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('dotenv').config();

const UserSchema = new Schema({
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
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
});


async function createAdminUser() {
    const adminUser = await User.findOne({ username: 'admin' });
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);
    
    if (!adminUser) {
      const admin = new User({
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

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = {User, createAdminUser};