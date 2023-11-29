const {Router} = require('express');
const routes = new Router();
const UserController = require('./controllers/UserController');
const {register, login} = require('./controllers/auth');
const { authenticate } = require('./middlewares/auth');
const { createAdminUser , Admin, verifyAdmin } = require('./models/Admin');


routes.get('/', async (req, res) => {
    await createAdminUser();
    res.send('Hello World');
});



routes.post('/register', register);
routes.post('/login', login);


routes.get('/profile', authenticate, (req, res) => {
    res.json(req.user);
});

routes.put('/admin/alterar/:userId', authenticate, verifyAdmin, async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      const admin = await Admin.findById(req.params.userId);
      if (!user && !admin) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (user) {
        Object.assign(user, req.body);
        await user.save();
        return res.json(user);
      }
      Object.assign(admin, req.body);

      await admin.save();
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

routes.post('/users', UserController.createUser);
routes.get('/users/:username', UserController.getUser);
routes.put('/users/:username', UserController.updateUser);
routes.delete('/users/:username', UserController.deleteUser);


module.exports = routes;