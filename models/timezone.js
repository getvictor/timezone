var config = require('../config.json');

module.exports = function(sequelize, DataTypes) {
  var Timezone = sequelize.define('Timezone', {
    name: { type: DataTypes.STRING(config.maxStringLength), allowNull: false},
    city: { type: DataTypes.STRING(config.maxStringLength), allowNull: false},
    minutesFromGMT: { type: DataTypes.INTEGER, allowNull: false}
  }, {
    classMethods: {
      associate: function(models) {
        Timezone.belongsTo(models.User);
      }
    }
  });

  return Timezone;
};
