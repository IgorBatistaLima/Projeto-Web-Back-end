const { Router } = require('express');
const routes = new Router();
const UserController = require('./controllers/UserController');
const { register, login } = require('./controllers/AuthController');
const auth = require('./middlewares/auth');
const { User, createAdminUser } = require('./models/User');
const isAdmin = require('./middlewares/isAdmin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Post = require('./models/Posts');
const Category = require('./models/Category');
const Comments = require('./models/Comments');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { MockUsers, MockCategories, MockPosts, MockComments } = require('./mock/install');


require('dotenv').config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
      description: 'API para um blog',
      contact: {
        name: 'Rafael Alves',
        email: ''
      },
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ],

    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID do usuário'
            },
            name: {
              type: 'string',
              description: 'Nome do usuário'
            },
            username: {
              type: 'string',
              description: 'Nome de usuário'
            },
            password: {
              type: 'string',
              description: 'Senha do usuário'
            },
            role: {
              type: 'string',
              description: 'Função do usuário'
            }
          }
        },
        Post: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID do post'
            },
            title: {
              type: 'string',
              description: 'Título do post'
            },
            content: {
              type: 'string',
              description: 'Conteúdo do post'
            },

          }
        },
        Category: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID da categoria'
            },
            title: {
              type: 'string',
              description: 'Título da categoria'
            }
          }
        },
        Comments: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID do comentário'
            },
            content: {
              type: 'string',
              description: 'Conteúdo do comentário'
            },

          }
        },
      },

      securitySchemes: {

        bearerAuth: {

          type: 'http',

          scheme: 'bearer',

          bearerFormat: 'JWT',

        },

      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ['./src/routes.js'],
};

const specs = swaggerJsdoc(options);

routes.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

routes.get('/', async (req, res) => {
  res.send('Welcome');
});


routes.post('/register', register);
routes.post('/login', login);


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna a lista de usuários
 *     description: Esta rota retorna uma lista de todos os usuários registrados no sistema.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro do servidor
 */

/**
 * @swagger
 * /posts/find-all/{limmit}/{page}:
 *   get:
 *     summary: Retorna a lista de postagens
 *     description: Esta rota retorna uma lista de todas as postagens no sistema.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: limmit
 *         required: true
 *         schema:
 *           type: integer
 *         description: O número de postagens para retornar
 *       - in: path
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *         description: A página de postagens para retornar
 *     responses:
 *       200:
 *         description: A lista de postagens
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro do servidor
 */

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Retorna a lista de categorias
 *     description: Esta rota retorna uma lista de todas as categorias no sistema.
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: A lista de categorias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro do servidor
 */

/**
 * @swagger
 * /comments/find-all:
 *   get:
 *     summary: Retorna a lista de comentários
 *     description: Esta rota retorna uma lista de todos os comentários no sistema.
 *     tags:
 *       - Comments
 *     responses:
 *       200:
 *         description: A lista de comentários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comments'
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro do servidor
 */
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


routes.post('/posts/create', auth, async (req, res) => {
  try {

    const { authorization } = req.headers;
    const { title, content, categoryId } = req.body;

    const splited = authorization.split(' ')[1];
    const decoded = jwt.verify(splited, process.env.SECRET_KEY);
    const post = new Post({ title, content, author: decoded._id });
    if (categoryId) {
      post.categories.push(categoryId);
    }
    if (commentId) {
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
    if (commentId) {
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
    const post = await Post.findById(postId)
      .populate({
        path: 'author categories',
        select: '-password'
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          model: 'User',
          select: '-password'
        }
      });
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o post', errorMessage: error.toString() });
  }
});



routes.get('/posts/find-all/:limmit/:page', auth, async (req, res) => {
  try {
    const limmit = parseInt(req.params.limmit);
    const page = parseInt(req.params.page);
    const skip = (page - 1) * limmit;

    const posts = await Post.find({})
      .populate({ path: 'author categories comments', select: '-password' })
      .skip(skip)
      .limit(limmit);

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
    const category = new Category({ title });
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
    const comentario = {
      content: content,
      author: decoded._id
    }
    const comment = new Comments(comentario);
    await comment.save().then(async (comment) => {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post não encontrado' });
      }
      post.comments.push(comment._id);
      await post.save();
    });

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
    const comment = await Comments.find(commentId);
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
    const comments = await Comments.find({ comment: commentId }).populate({ path: 'author', select: '-password' });
    if (comments) {
      for (const comment of comments) {
        post.comments = post.comments.filter((comment) => comment.toString() !== commentId);
        await post.save();
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir o comentário', errorMessage: error.toString() });
  }
}
);

routes.get('/comments/find-all', auth, async (req, res) => {
  try {
    const comments = await Comments.find({}).populate({ path: 'author', select: '-password' });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os comentários', errorMessage: error.toString() });
  }
});


routes.get("/install", async (req, res) => {
  try {

    // USUARIOS

    const users = await User.insertMany(MockUsers);

    // CATEGORIAS
    const categories = await Category.insertMany(MockCategories);

    // COMENTARIOS

    let commentsConfig = [];
    MockComments.forEach(async (comment) => {
      const author = users[Math.floor(Math.random() * users.length)];
      comment.author = author._id;
      commentsConfig.push(comment);
    });
    const comments = await Comments.insertMany(commentsConfig);

    // POST

    let postsConfig = [];
    MockPosts.forEach(async (post) => {
      const author = users[Math.floor(Math.random() * users.length)];
      post.author = author._id;
      const category = categories[Math.floor(Math.random() * categories.length)];
      post.categories.push(category._id);
      const comment = comments[Math.floor(Math.random() * comments.length)];
      post.comments.push(comment._id);
      postsConfig.push(post);
    });
    const posts = await Post.insertMany(postsConfig);

    

    res.status(200).json({ message: "Dados inicializados com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar dados iniciais.", errorMessage: error.toString() });
  }
}
);





module.exports = routes;