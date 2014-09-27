var rest = require('restler');

var BASE_URL = 'http://localhost:3000';
var USERNAME = 'test';
var PASSWORD = 'abc123';
var token = '';

exports.registerUser = function(test){
  test.expect(1);
  rest.postJson(BASE_URL + '/users/register', {
    username: USERNAME,
    password: PASSWORD
  }).on('complete', function(result, response) {
    if (response.statusCode === 201) {
      test.ok(result.token, 'Authorization token should be present.');
      token = result.token;
    } else {
      test.ok(false, result.message);
    }
    test.done();
  });

};

// TODO: Logout, make sure authorization no longer works, and log back in

var name = 'TimezoneName';
var city = 'Timezone City';
var minutesFromGMT = 10;
var id = -1;

var createTimezone = function(name, city, minutesFromGMT, test, callback) {
  rest.postJson(BASE_URL + '/timezones', {
    name: name,
    city: city,
    minutesFromGMT : minutesFromGMT
  }, {
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).on('complete', function(result, response) {
    if (response.statusCode === 201) {
      test.ok(result.id > 0, 'Timezone id must be positive.');
      id = result.id;
    } else {
      test.ok(false, result.message);
    }
    callback();
  });
};

exports.addTimezone = function(test) {
  test.expect(1);
  createTimezone(name, city, minutesFromGMT, test, function() {
    test.done();
  });
};

exports.getTimezones = function(test) {
  test.expect(5);
  rest.get(BASE_URL + '/timezones', {
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).on('complete', function(result, response) {
    if (response.statusCode === 200) {
      test.strictEqual(result.results.length, 1);
      test.strictEqual(result.results[0].name, name);
      test.strictEqual(result.results[0].city, city);
      test.strictEqual(result.results[0].minutesFromGMT, minutesFromGMT);
      test.strictEqual(result.results[0].id, id);
    } else {
      test.ok(false, result.message);
    }
    test.done();
  });

};

exports.addMoreTimezones = function(test) {
  test.expect(3);

  // Create 2 timezones, and then fetch them all.
  createTimezone('Name2', 'City2', 10000, test, function() {
    createTimezone('Name3', 'City3', 0, test, function() {

      rest.get(BASE_URL + '/timezones', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }).on('complete', function(result, response) {
        if (response.statusCode === 200) {
          test.strictEqual(result.results.length, 3);
        } else {
          test.ok(false, result.message);
        }
        test.done();
      });
    });
  });

};

exports.updateTimezone = function(test) {
  test.expect(3);

  var newName = 'NewName';
  var newCity = 'NewCity';
  var newMinutesFromGMT = 60;

  rest.putJson(BASE_URL + '/timezones/' + id, {
    name: newName,
    city: newCity,
    minutesFromGMT : newMinutesFromGMT
  }, {
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).on('complete', function(result, response) {
    if (response.statusCode === 201) {
      // Fetch all the timezones to make sure update was made.
      rest.get(BASE_URL + '/timezones', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }).on('complete', function(result, response) {
        if (response.statusCode === 200) {
          for (var i = 0; i < result.results.length; i++) {
            if (result.results[i].id === id) {
              test.strictEqual(result.results[i].name, newName);
              test.strictEqual(result.results[i].city, newCity);
              test.strictEqual(result.results[i].minutesFromGMT, newMinutesFromGMT);
            }
          }
        } else {
          test.ok(false, result.message);
        }
        test.done();
      });

    } else {
      test.ok(false, result.message);
      test.done();
    }
  });

};

// TODO: Test updating another user's timezone.

exports.deleteTimezone = function(test) {

  rest.del(BASE_URL + '/timezones/' + id, {
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).on('complete', function(result, response) {
    if (response.statusCode === 201) {
      // Fetch all the timezones to make sure deletion was made.
      rest.get(BASE_URL + '/timezones', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }).on('complete', function(result, response) {
        if (response.statusCode === 200) {
          test.strictEqual(result.results.length, 2);
        } else {
          test.ok(false, result.message);
        }
        test.done();
      });

    } else {
      test.ok(false, result.message);
      test.done();
    }
  });

};
