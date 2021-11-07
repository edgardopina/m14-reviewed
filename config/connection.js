const Sequelize = require('sequelize'); // import the Sequelize constructor from the library
require('dotenv').config(); // import module to keep secrets


// Create connection to our database, passing MySQL info for username and password as dotenv variables!

// When the app is deployed to heroku, it will have access to Heroku's process.env.JAWSDB_URL variable and use that 
// value to connect.Otherwise, it will continue using the localhost configuration.
// Create connection to our database, passing MySQL info for username and password as dotenv variables!
const sequelize = process.env.JAWSDB_URL
? new Sequelize(process.env.JAWSDB_URL)
: new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
   host: 'localhost',
   dialect: 'mysql',
   port: 3306,
   logging: true,
});

module.exports = sequelize;
