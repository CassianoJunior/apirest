const User = require('../models/User');

module.exports = {
  async store({ name, email, password }){
    const user = await User.create({ name, email, password});

    return user;
  },

  async getOne(email){

    const user = await User.findOne({ where: { email }});
    
    return user;
  }
}