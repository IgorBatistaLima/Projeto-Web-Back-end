const {Router} = require('express');
const routes = new Router();
const UserController = require('./controllers/UserController');
const {register, login} = require('./controllers/AuthController');
const  auth  = require('./middlewares/auth');
const {User ,createAdminUser} = require('./models/User');
const isAdmin = require('./middlewares/isAdmin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Post = require('./models/Posts');
const Category = require('./models/Category');
const Comments = require('./models/Comments');

require('dotenv').config();


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

routes.put('/admin/update/', auth, isAdmin, async (req, res) => {
    try {

    const user = await User.findOne({ username: req.body.username });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    user.set(req.body);
    
    if (req.body.newUsername) {
      user.username = req.body.newUsername;
    }
    user.password = await bcrypt.hash(req.body.password, 10);

    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Erro ao atualizar o usuário', details: error.message }); // Envia o erro na resposta
  }
}
);

routes.post('/posts/create',auth, async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { title, content, categoryId } = req.body;	

    const splited = authorization.split(' ')[1];
    const decoded = jwt.verify(splited, process.env.SECRET_KEY);
    const post = new Post({ title, content, author: decoded._id });
    if (categoryId) {
      post.categories.push(categoryId);
    }
    if(commentId){
      post.comments.push(commentId);
    }
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar o post', errorMessage: error.toString() });
  }
});


routes.put("/posts/update", auth, async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { title, content, categoryId, postId, commentId } = req.body;
    const splited = authorization.split(' ')[1];
    const decoded = jwt.verify(splited, process.env.SECRET_KEY);
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    if (post.author.toString() !== decoded._id && decoded.role !== 'admin') {
      return res.status(401).json({ error: 'Você não tem permissão para editar este post' });
    }
    post.set(req.body);
    if (categoryId) {
      const categoryExists = post.categories.find((category) => category.toString() === categoryId);
      if (!categoryExists) {
        post.categories.push(categoryId);
      } else {
        return res.status(201).json({ message: 'Categoria inserida já existe no Post' });
      }
    } 
    if(commentId){
      const commentExists = post.comments.find((comment) => comment.toString() === commentId);
        post.comments.push(commentId);
    }
    await post.save();
    res.json(post);
      
  } catch (error) {
    res.status(500).json({ error: 'Erro ao editar o post', errorMessage: error.toString() });
  }
});

routes.delete('/posts/delete', auth, async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { postId } = req.body;
    const splited = authorization.split(' ')[1];
    const decoded = jwt.verify(splited, process.env.SECRET_KEY);
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    if (post.author.toString() !== decoded._id && decoded.role !== 'admin') {
      return res.status(401).json({ error: 'Você não tem permissão para excluir este post' });
    }
    await post.delete();
    res.json({ message: 'Post excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir o post', errorMessage: error.toString() });
  }
});

routes.put('/posts/remove-category', auth, async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { categoryId, postId } = req.body;
    const splited = authorization.split(' ')[1];
    const decoded = jwt.verify(splited, process.env.SECRET_KEY);
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    if (post.author.toString() !== decoded._id && decoded.role !== 'admin') {
      return res.status(401).json({ error: 'Você não tem permissão para editar este post' });
    }
    post.categories = post.categories.filter((category) => category.toString() !== categoryId);
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao editar o post', errorMessage: error.toString() });
  }
})

routes.get('/posts/find-one', auth, async (req, res) => {
  try {
    const { postId } = req.body;
    const post = await Post.findById(postId).populate({ path: 'author categories comments', select: '-password' });
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o post', errorMessage: error.toString() });
  }
});

routes.get('/posts/find-all', auth, async (req, res) => {
  try {
    const posts = await Post.find({}).populate({ path: 'author categories comments ', select: '-password' });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os posts', errorMessage: error.toString() });
  }
});

routes.get('/posts/find-by-category', auth, async (req, res) => {
  try {
    const { categoryId } = req.body;
    const posts = await Post.find({ categories: categoryId }).populate({ path: 'author categories comments', select: '-password' });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os posts', errorMessage: error.toString() });
  }
});

routes.post('/category/create', auth, async (req, res) => {
  try {
    const { title } = req.body;
    const category = new Category({ title});
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar a categoria', errorMessage: error.toString() });
  }
});

routes.get('/category', auth, async (req, res) => {
  try {
    const category = await Category.find({});
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar as categorias', errorMessage: error.toString() });
  }
});

routes.delete('/category/delete', auth, async (req, res) => {
  try {
    const { categoryId } = req.body;
    const category = await Category.findOneAndDelete(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    const posts = await Post.find({ categories: categoryId }).populate({ path: 'author categories', select: '-password' });
    if (posts) {
      for (const post of posts) {
        post.categories = post.categories.filter((category) => category.toString() !== categoryId);
        await post.save();
      }
    }

    res.json({ message: 'Categoria excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir a categoria', errorMessage: error.toString() });
  }
});

  routes.post('/comments/create', auth, async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { content, postId } = req.body;
    const splited = authorization.split(' ')[1];
    const decoded = jwt.verify(splited, process.env.SECRET_KEY);
    const comment = new Comments({ content, post: postId, author: decoded._id });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar o comentário', errorMessage: error.toString() });
  }
});

  routes.put('/comments/update', auth, async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { content, commentId } = req.body;
    const splited = authorization.split(' ')[1];
    const decoded = jwt.verify(splited, process.env.SECRET_KEY);
    const comment = await Comments.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }
    if (comment.author.toString() !== decoded._id && decoded.role !== 'admin') {
      return res.status(401).json({ error: 'Você não tem permissão para editar este comentário' });
    }
    comment.set(req.body);
    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao editar o comentário', errorMessage: error.toString() });
  }
});

  routes.delete('/comments/delete', auth, async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { commentId } = req.body;
    const splited = authorization.split(' ')[1];
    const decoded = jwt.verify(splited, process.env.SECRET_KEY);
    const comment = await Comments.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }
    if (comment.author.toString() !== decoded._id && decoded.role !== 'admin') {
      return res.status(401).json({ error: 'Você não tem permissão para excluir este comentário' });
    }
    await comment.delete();
    res.json({ message: 'Comentário excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir o comentário', errorMessage: error.toString() });
  }
});


routes.post('/users', UserController.createUser);
routes.get('/users/:username', UserController.getUser);
routes.put('/users/:username', UserController.updateUser);
routes.delete('/users/:username', UserController.deleteUser);


module.exports = routes;