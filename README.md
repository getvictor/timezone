# Timezone Web Application

Production deployment at: https://timezone-getvictor.rhcloud.com

## Functional Features

This application shows time in user-configurable timezones.

* User can create an account and log in
* When logged in, user can see, edit and delete timezones he entered
* When entered, each entry has a Name, Name of city in timezone, difference to UTC time
* When displayed, each entry has also current time
* Filter by timezone names

## Technical Features

* Single page application
  * All user actions can be performed via the REST API, including authentication.
  * JSON Web Tokens used for authentication
* Unit tests
* HTTPS (in production)

## Technologies Used

* [AngularJS](https://angularjs.org/)
* [Bootstrap](http://getbootstrap.com/)
* [Node.js](http://nodejs.org/)
  * [Express](http://expressjs.com/)
  * [Sequelize](http://sequelizejs.com/)
* MySQL

## Dependencies

* Node with NPM
* MySQL

## Configuration

Review/edit `config.json`

## Deployment

`npm install && npm start`

Note: when starting up, the dev deployment clears the DB.

For production deployment: `NODE_ENV=production npm start`

## Testing

After dev deployment, `npm test`
