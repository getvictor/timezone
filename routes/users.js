var express = require('express');
var router = express.Router();
var db = require('../models');
var utils = require('../lib/utils');
var jsonwebtoken = require('jsonwebtoken');
var config = require('../config.json');

/**
 * Create a user.
 * Response codes:
 * 201: Success
 * 400: Username already exists or validation errors.
 */
router.route('/register').post(function(req, res, next) {

  // Validate inputs.
  req.checkBody('username', 'Username is required.').notEmpty();
  req.checkBody('password', 'Password is required.').notEmpty();

  var errors = req.validationErrors();

  if (!errors) {

    // Check for duplicate username.
    db.User.count({
      where : { username: req.body.username }
    }).success(function(result) {
      if (result === 0) {

        // Create user.
        var user = db.User.build({
          username: req.body.username,
          password: utils.hashPassword(req.body.password)
        });

        user.save().success(function(result) {
          console.log('Persisted user "' + user.username + '" instance.');
          res.status(201);
          res.json({
            token: jsonwebtoken.sign(user, config.jwtSecretToken, { expiresInMinutes: 60 })
          });
        }).error(function(err) {
          utils.handleDbError(res, err);
        });

      } else {
        // Username already exists.
        res.status(400);
        res.json({
          message: 'Username "' + req.body.username + '" is already taken.'
        });
      }
    }).error(function(err) {
      utils.handleDbError(res, err);
    });

  } else {
    utils.addValidationErrors(res, errors);
  }

});

/**
 * Log in a user.
 * Response codes:
 * 200: Success
 * 400: Username/password incorrect, or validation errors.
 */
router.route('/login').post(function(req, res, next) {

  // Validate inputs.
  req.checkBody('username', 'Username is required.').notEmpty();
  req.checkBody('password', 'Password is required.').notEmpty();

  var errors = req.validationErrors();

  if (!errors) {
    db.User.find({
      where : { username: req.body.username }
    }).success(function(result) {
      if (result) {
        // Check password.
        if (utils.passwordCorrect(req.body.password, result.password)) {
          res.status(200);
          res.json({
            token: jsonwebtoken.sign(user, config.jwtSecretToken, { expiresInMinutes: 60 })
          });
        } else {
          // Bad password.
          res.status(400);
          res.json({
            message: 'Password incorrect.'
          });
        }
      } else {
        // Bad username.
        res.status(400);
        res.json({
          message: 'Username incorrect.'
        });
      }
    }).error(function(err) {
      utils.handleDbError(res, err);
    });
  } else {
    utils.addValidationErrors(res, errors);
  }

});

module.exports = router;
