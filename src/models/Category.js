const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('dotenv').config();

const CategorySchema = new Schema({
    title: {
        type: String,
        required: true,
    },

});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
