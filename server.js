#!/usr/bin/env node

var debug = require('debug')('timezone');
var app = require('./app');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP;

app.set('port', server_port);

var server = app.listen(server_port, server_ip_address, null, function() {
  console.log('Express server listening on port ' + server.address().port);
  console.log('NODE_ENV:' + process.env.NODE_ENV);
});
