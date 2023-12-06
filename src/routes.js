const {Router} = require('express');
const routes = new Router();
const UserController = require('./controllers/UserController');
const {register, login} = require('./controllers/AuthController');
const  auth  = require('./middlewares/auth');
const {User ,createAdminUser} = require('./models/User');
const isAdmin = require('./middlewares/isAdmin');
const jwt = require('jsonwebtoken');



routes.get('/', async (req, res) => {
    await createAdminUser();
    res.send('Hello World');
});


routes.post('/register', register);
routes.post('/login', login);

routes.get('/users', auth, async (req, res) => {
  const users = await User.find({});
  res.json(users);
});


routes.get('/profile', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.SECRET_KEY);

  try {
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).send({ error: 'Usuário não encontrado!' });
    }
    res.json(user);
  } catch (error) {
    return res.status(500).send({ error: 'Erro interno do servidor' });
  }
});



routes.get('/admin', auth, isAdmin, (req, res) => {
  res.json({ message: 'You are an authenticated admin' });
});


routes.post('/admin/criar', auth, isAdmin, async (req, res) => {
  try {
    const user = new User({ ...req.body, role: 'admin' });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar o administrador' });
  }
});

routes.delete('/admin/delete/:username', auth, isAdmin, async (req, res) => {
  try {
    const result = await User.deleteOne({ username: req.params.username });
    if (result.n === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error(error); // Imprime o erro no console
    res.status(500).json({ error: 'Erro ao excluir o usuário', details: error.message }); // Envia o erro na resposta
  }
});

routes.put('/admin/update/:username', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    user.set(req.body);
    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error); // Imprime o erro no console
    res.status(500).json({ error: 'Erro ao atualizar o usuário', details: error.message }); // Envia o erro na resposta
  }
}
);



routes.post('/users', UserController.createUser);
routes.get('/users/:username', UserController.getUser);
routes.put('/users/:username', UserController.updateUser);
routes.delete('/users/:username', UserController.deleteUser);


module.exports = routes;