module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true, allowNull: false},
    password: { type: DataTypes.STRING, allowNull: false}
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Timezone);
      }
    }
  });

  return User;
};
