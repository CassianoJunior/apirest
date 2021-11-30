const express = require('express');
const authController = require('./controllers/AuthController');
const authMiddleware = require('./middlewares/authMiddleware');
const crudController = require('./controllers/CRUDController')

const routes = express.Router();

routes.use('/users', authController);

routes.use(authMiddleware);

routes.use('/users/projects', crudController);

module.exports = routes;