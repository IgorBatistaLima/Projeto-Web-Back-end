const {Router} = require('express');
const routes = new Router();
const UserController = require('./controllers/UserController');
const {register, login} = require('./controllers/auth');
const { authenticate } = require('./middlewares/auth');
const { createAdminUser , Admin } = require('./models/Admin');


routes.get('/', async (req, res) => {
    await createAdminUser();
    res.send('Hello World');
});



routes.post('/register', register);
routes.post('/login', login);


routes.get('/profile', authenticate, (req, res) => {
    
});

routes.post('/users', UserController.createUser);
routes.get('/users/:username', UserController.getUser);
routes.put('/users/:username', UserController.updateUser);
routes.delete('/users/:username', UserController.deleteUser);


module.exports = routes;