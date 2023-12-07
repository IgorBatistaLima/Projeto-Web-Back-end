const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const CategorySchema = require('./Category');

require('dotenv').config();

const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    categories: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}],
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date_created: {
        type: Date,
        default: Date.now,
    },

});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
