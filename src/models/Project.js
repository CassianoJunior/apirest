const { Model, DataTypes } = require('sequelize');

class Project extends Model {
  static init(sequelize){
    super.init({
      title: DataTypes.STRING,
      description: DataTypes.STRING,
    }, {
      sequelize
    })
  }

  static associate(models){
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

module.exports = Project;