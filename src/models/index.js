const { Sequelize } = require('sequelize');
const config = require('../../config/database');

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
});

const models = {
  User: require('./user')(sequelize),
  Project: require('./project')(sequelize),
  Event: require('./event')(sequelize),
  Community: require('./community')(sequelize),
  CommunityMembership: require('./communityMembership')(sequelize),
};

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
