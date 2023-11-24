const express = require('express');
const app= express();
const routes = express.Router();

routes.get('/', (req, res) => {
  res.send('hello');
});

routes.post('/login', (req, res) => {
   
});

app.use(routes);

module.exports = app;