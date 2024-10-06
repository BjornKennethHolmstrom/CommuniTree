const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CommunityMembership = sequelize.define('CommunityMembership', {
    role: {
      type: DataTypes.ENUM('MEMBER', 'ADMIN'),
      allowNull: false,
      defaultValue: 'MEMBER'
    }
  });

  CommunityMembership.associate = (models) => {
    CommunityMembership.belongsTo(models.User);
    CommunityMembership.belongsTo(models.Community);
  };

  return CommunityMembership;
};
