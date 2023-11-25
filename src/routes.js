const {Router} = require('express');
const routes = new Router();
const UserController = require('./controllers/UserController');


routes.get('/', (req, res) => {
    res.send('Hello World');
});

routes.post('/users', UserController.createUser);
routes.get('/users/:username', UserController.getUser);
routes.put('/users/:username', UserController.updateUser);
routes.delete('/users/:username', UserController.deleteUser);


module.exports = routes;