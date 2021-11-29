const express = require('express');
const authController = require('./controllers/AuthController');
const authMiddleware = require('./middlewares/authMiddleware');

const routes = express.Router();

routes.use('/users', authController);

routes.use(authMiddleware);

routes.get('/', (req, res) => {
  return res.json({ ok: 'true' })
});

module.exports = routes;