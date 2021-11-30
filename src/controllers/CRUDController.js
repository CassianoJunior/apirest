const express = require('express');
const Project = require('../models/Project');
const User = require('../models/User');

const routes = express.Router();

routes.get('/list', async (req, res) => {
  try{
    const projects = await Project.findAll();

    return res.status(200).json({ projects });

  } catch(err){
    return res.status(400).json({ error: 'Error listing projects' });
  }
});

routes.get('/find/:user_id', async (req, res) => {
  try{
    const { user_id } = req.params;
    const user = await User.findByPk(user_id, {
      include: { association: 'projects' }
    });

    user.password = undefined;

    return res.status(200).json(user);

  } catch(err){
    return res.status(400).json({ error: 'Error listing user projects' });
  }
});

routes.post('/:user_id/create', async (req, res) => {
  try{
    const { user_id } = req.params;
    const user = await User.findByPk(user_id);
    
    if(!user)
      return res.status(400).json({ error: 'User not found' });

    const { title, description } = req.body;

    const project = await Project.create({
      title,
      description,
      user_id
    });

    return res.status(201).json(project);
  } catch(err){
    return res.status(400).json({ error: 'Error creating project' })
  }
});

routes.put('/:user_id/update/:project_id', async (req, res) => {
  try{
    const { project_id, user_id } = req.params;

    const user = User.findByPk(user_id);

    if(!user)
      return res.status(400).json({ error: 'User not found' });

    const project = await Project.findByPk(project_id);

    if(!project)
      return res.status(400).json({ error: 'Project not found' });

    const { title, description } = req.body;

    await Project.update({ title, description, user_id }, {
      where: {
        id: project_id
      }
    });
    
    return res.status(200).json({ message: 'Successfully updated' });
  } catch(err){
    return res.status(400).json({ error: 'Error updating project' });
  }
});

routes.delete('/:user_id/delete/:project_id', async (req, res) => {
  try{
    const { project_id, user_id } = req.params;

    const user = User.findByPk(user_id);

    if(!user)
      return res.status(400).json({ error: 'User not found' });

    const project = await Project.findByPk(project_id);

    if(!project)
      return res.status(400).json({ error: 'Project not found' });

    await Project.destroy({ where: { id: project_id } });
    
    return res.status(200).json({ message: 'Successfully deleted' });
  } catch(err){
    return res.status(400).json({ error: 'Error deleting project' });
  }
});

module.exports = routes;