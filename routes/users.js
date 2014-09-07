var express = require('express');
var router = express.Router();
var db = require('../models')
var utils = require('../lib/utils');

/**
 * Create a user.
 */
router.route('/').get(function(req, res, next) {
  var user = db.User.build({
    username: req.query.username,
    password: utils.hashPassword(req.query.password)
  });

  // TODO: Check for duplicate username.

  user.save().complete(function(err) {
    if (!!err) {
      return next(new Error('The instance has not been saved:' + err));
    } else {
      console.log('Persisted user instance.')
      res.json({success:true});
    }
  });
});

module.exports = router;
