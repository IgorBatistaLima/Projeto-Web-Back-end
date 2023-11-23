const express = require('express');
const app= express();
const routes = express.Router();

routes.get('/', (req, res) => {
  res.send('hello');
});

routes.get('/login', (req, res) => {
    res.json('login');
});

app.use(routes);

module.exports = app;