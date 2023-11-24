const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    isAdmin: {
        type: Boolean,
        default: false,
        required: true,
    },
    role : {
        type: String,
        enum : ['user', 'admin'],
        default : 'user'
    },

    });

module.exports = mongoose.model('User', UserSchema);

