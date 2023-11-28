const app = require('./app')
const mongoose = require('mongoose');
const { createAdminUser } = require('./models/Admin');




app.listen(3000, () => {
    console.log('porta 3000');
});