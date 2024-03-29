/**
 * The idea of this file is to configure a connection to the database and to collect all model definitions.
 * Once everything is in place, we will call the method associate on each of the models. This method will
 * be used to associate the model with others.
 */

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var lodash    = require('lodash');
var config = require('../config.json');
var db        = {};

var sequelize = new Sequelize(
  config.mysqlOptions.database,
  process.env.OPENSHIFT_MYSQL_DB_USERNAME || config.mysqlOptions.user,
  process.env.OPENSHIFT_MYSQL_DB_PASSWORD || config.mysqlOptions.password,
  {
    host: process.env.OPENSHIFT_MYSQL_DB_HOST || config.mysqlOptions.host,
    port: process.env.OPENSHIFT_MYSQL_DB_PORT || config.mysqlOptions.port,
    // Use a pool of connections for higher performance.
    pool: {maxConnections: 5, maxIdleTime: 30}
  }
);

fs.readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

// Force DB resync unless we're in production.
var forceSync = process.env.NODE_ENV === 'production' ? false : true;

sequelize.sync({force: forceSync}).complete(function(err) {
  if (!!err) {
    console.log('An error occurred while creating the table:', err);
  } else {
    console.log('Sequelize sync worked! ' + (forceSync ? 'DB cleared.' : ''));
  }
});

module.exports = lodash.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db);
