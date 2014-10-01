appServices.factory('AlertsService', function() {

  var alerts = [];

  return {
    alerts: alerts,

    error: function(data) {
      if (data.message) {
        alerts.push({
          type: 'danger',
          msg: data.message
        });
      } else {
        alerts.push({
          type: 'danger',
          msg: 'Could not complete request.'
        });
      }
    },

    clear: function(index) {
      alerts.splice(index, 1);
    },

    clearAll: function() {
      while(alerts.length > 0) {
        alerts.pop();
      }
    }
  };

});
