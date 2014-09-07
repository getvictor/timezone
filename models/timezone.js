module.exports = function(sequelize, DataTypes) {
  var Timezone = sequelize.define('Timezone', {
    title: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Timezone.belongsTo(models.User)
      }
    }
  });

  return Timezone;
}
