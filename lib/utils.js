var bcrypt = require('bcrypt');

/**
 * Hash the password using bcrypt.
 */
exports.hashPassword = function(value) {
  var salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(value, salt);
};

/**
 * Compare password using bcrypt.
 */
exports.passwordCorrect = function(password, hash) {
  return bcrypt.compareSync(password, hash);
};

/**
 * Add validation errors to the response.
 */
exports.addValidationErrors = function(res, errors) {
  res.status(400);
  res.json({
    message: 'validationErrors',
    validationErrors: errors
  });
};

/**
 * Handle DB error.
 */
exports.handleDbError = function(res, err) {
  console.log('DB error: ' + err);
  res.status(500);
  res.json({
    message: err
  });
};
