var bcrypt = require('bcrypt');

/**
 * Hash the password using bcrypt.
 */
exports.hashPassword = function(value) {
  var salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(value, salt);
};
