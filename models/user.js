var config = require('../config.json');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: { type: DataTypes.STRING(config.maxStringLength), unique: true, allowNull: false},
    password: { type: DataTypes.STRING(1000), allowNull: false}
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Timezone);
      }
    }
  });

  return User;
};
