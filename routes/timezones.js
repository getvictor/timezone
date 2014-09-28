var express = require('express');
var router = express.Router();
var db = require('../models');
var utils = require('../lib/utils');
var jsonwebtoken = require('jsonwebtoken');
var jwt = require('express-jwt');
var config = require('../config.json');
var moment = require('moment');

// Require authentication.
router.use(jwt({secret: config.jwtSecretToken}));

/**
 * Get all timezones for the user.
 */
router.route('/').get(function(req, res, next) {
  db.User.find(req.user).success(function(user) {
    if (user) {
      user.getTimezones().success(function(results) {
        // Populate current time in each result.
        var unixOffset = moment().valueOf();
        for (var i = 0; i < results.length; i++) {
          results[i] = results[i].toJSON();
          results[i].currentTime = moment(unixOffset).utc().add(results[i].minutesFromGMT, 'minutes').format('LT');
        }
        res.status(200);
        res.json({
          results: results
        });
      }).error(function(err) {
        utils.handleDbError(res, err);
      });
    } else {
      res.status(400);
      res.json({
        message: 'User with id:' + req.user + 'cannot be found.'
      });
    }
  }).error(function(err) {
    utils.handleDbError(res, err);
  });

});

/**
 * Create a timezone.
 */
router.route('/').post(function(req, res, next) {

  // Validate inputs.
  req.checkBody('name', 'Name is required (max length: 255)').len(1, config.maxStringLength);
  req.checkBody('city', 'City is required (length:0-255)').len(0, config.maxStringLength);
  req.checkBody('minutesFromGMT', 'minutesFromGMT is required').isInt();

  var errors = req.validationErrors();

  if (!errors) {
    db.User.find(req.user).success(function(user) {
      if (user) {
        var timezone = db.Timezone.build({
          name: req.body.name,
          city: req.body.city,
          minutesFromGMT: req.body.minutesFromGMT
        });

        timezone.save().success(function(result) {
          user.addTimezone(timezone).success(function(result) {
            res.status(201);
            res.json({
              id: timezone.id
            });
          }).error(function(err) {
            utils.handleDbError(res, err);
          });
        }).error(function(err) {
          utils.handleDbError(res, err);
        });

      } else {
        res.status(400);
        res.json({
          message: 'User with id:' + req.user + 'cannot be found.'
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
 * Update a timezone.
 */
router.route('/:id').put(function(req, res, next) {

  // Validate inputs.
  req.checkParams('id', 'Timezone id must be an integer.').isInt();
  req.checkBody('name', 'Name is required (max length: 255)').len(1, config.maxStringLength);
  req.checkBody('city', 'City is required (length:0-255)').len(0, config.maxStringLength);
  req.checkBody('minutesFromGMT', 'minutesFromGMT is required').isInt();

  var errors = req.validationErrors();

  if (!errors) {
    // Fetch the timezone.
    db.Timezone.find(req.params.id).success(function(timezone) {
      if (timezone && timezone.UserId === req.user) {
        timezone.updateAttributes({
          name: req.body.name,
          city: req.body.city,
          minutesFromGMT: req.body.minutesFromGMT
        }).success(function(result) {
          res.status(201);
          res.json({});
        }).error(function(err) {
          utils.handleDbError(res, err);
        });
      } else {
        res.status(400);
        res.json({
          message: 'Timezone with id:' + req.params.id + 'cannot be found.'
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
 * Delete a timezone.
 */
router.route('/:id').delete(function(req, res, next) {

  // Validate inputs.
  req.checkParams('id', 'Timezone id must be an integer.').isInt();

  var errors = req.validationErrors();

  if (!errors) {
    // Fetch the timezone.
    db.Timezone.find(req.params.id).success(function(timezone) {
      if (timezone && timezone.UserId === req.user) {
        // Delete the timezone.
        timezone.destroy().success(function(result) {
          res.status(200);
          res.json({});
        }).error(function(err) {
          utils.handleDbError(res, err);
        });
      } else {
        res.status(400);
        res.json({
          message: 'Timezone with id:' + req.params.id + 'cannot be found.'
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
