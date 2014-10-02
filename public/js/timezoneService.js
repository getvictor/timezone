/**
 * Service for persisting and formatting timezones.
 */
appServices.factory('TimezoneService', function($http) {

  var timezoneToEdit;

  // Timezone parsing code derived from moment.js 2.8.3

  // +00:00 -00:00 +0000 -0000 or Z
  var parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi;
  // timezone chunker '+10:00' > ['10', '00'] or '-1530' > ['-15', '30']
  var parseTimezoneChunker = /([\+\-]|\d\d)/gi;

  var toInt = function(argumentForCoercion) {
    var coercedNumber = +argumentForCoercion,
        value = 0;

    if (coercedNumber !== 0 && isFinite(coercedNumber)) {
        if (coercedNumber >= 0) {
            value = Math.floor(coercedNumber);
        } else {
            value = Math.ceil(coercedNumber);
        }
    }

    return value;
  };

  return {

    setTimezoneToEdit : function(timezone) {
      timezoneToEdit = timezone;
    },

    getTimezoneToEdit : function() {
      return timezoneToEdit;
    },

    get : function() {
      return $http.get(options.apiUrl + '/timezones');
    },

    add : function(timezone) {
      return $http.post(options.apiUrl + '/timezones', timezone);
    },

    edit : function(timezone) {
      return $http.put(options.apiUrl + '/timezones/' + timezone.id, timezone);
    },

    delete : function(timezone) {
      return $http.delete(options.apiUrl + '/timezones/' + timezone.id, timezone);
    },

    timezoneMinutesFromString : function(string) {
      string = string || '';

      var possibleTzMatches = (string.match(parseTokenTimezone) || []),
          tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [],
          parts = (tzChunk + '').match(parseTimezoneChunker) || ['-', 0, 0],
          minutes = +(parts[1] * 60) + toInt(parts[2]);

      return parts[0] === '+' ? minutes : -minutes;
    },

    timezoneStringFromMinutes : function(minutes) {
      var result = '';
      if (minutes < 0) {
        result += '-';
        minutes = -minutes;
      } else {
        result += '+';
      }
      var hours = Math.floor(minutes / 60);

      var padZero = function(value) {
        if (value < 10) {
          return '0' + value;
        } else {
          return value;
        }
      };
      result += padZero(hours);
      result += ':';
      result += padZero(minutes % 60);
      return result;
    }

  };
});
