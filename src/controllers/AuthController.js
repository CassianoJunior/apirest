const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

const UserController = require('./UserController')

const routes = express.Router();

function generateToken(params = {}){
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 60 * 60 * 1, // 1 hour
  });
}

routes.post('/registration', async (req, res) => {
  try{
    const existingUser = await UserController.getOne(req.body.email);

    if(existingUser)
      return res.status(400).json({ error: 'User already exists' });

    const { name, email, password } = req.body;
    
    bcrypt.hash(password, 10, async (err, hash) => {
      const user = await UserController.store({ name, email, password: hash }); 
      err && console.log(err);
      user.password = undefined;
      res.status(201).json({
        user,
        token: generateToken({ id: user.id }),
      });
    })
  } catch(err){
    console.log(err)
    res.status(400).json({ error: 'Registration failed' })
  }

});

routes.post('/authenticate', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserController.getOne(email);

    if(!user)
      return res.status(400).json({ error: 'User not found' });
    
    if(!await bcrypt.compare(password, user.password))
      return res.status(400).json({ error: 'Invalid password' })

    user.password = undefined;
    res.json({ 
      user,
      token: generateToken({ id: user.id }),
    })
  } catch (err) {
    res.status(400).json({ error: 'Authentication failed' })
  }
});

module.exports = routes;