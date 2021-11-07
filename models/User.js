const { Model, DataTypes } = require('sequelize'); // import parent classes 
const bcrypt = require('bcrypt'); // library to encrypt password
const sequelize = require('../config/connection'); // gets DB connection

// create User model
class User extends Model {
   // setup method to run on instance data (each user) to check password
   checkPassword(loginPw) {
      // return bcrypt.compareSync(loginPw, this.password);
      // this can access this user's properties, including the password, which was stored as a hashed string.
      return bcrypt.compare(loginPw, this.password);
   }
}

// define table columns and configuration
// .init() method to initialize the model's data and configuration, passing in two objects
// as arguments: The first object will define the columns and data types for those columns.
// The second object it accepts configures certain options for the table.
User.init(
   //! table configuration options go here  (https://sequelize.org/v5/manual/models-definition.html#configuration)
   {
      id: {
         type: DataTypes.INTEGER,
         allowNull: false, 
         primaryKey: true, 
         autoIncrement: true,
      },
      username: {
         type: DataTypes.STRING,
         allowNull: false, 
      },
      email: {
         type: DataTypes.STRING,
         allowNull: false, 
         unique: true,
         validate: {
            isEmail: true,
         },
      },
      password: {
         type: DataTypes.STRING,
         allowNull: false, 
         validate: {
            len: [4], // password must be at least four characters long
         },
      },
   },
   {
      hooks: {
         async beforeCreate(newUserData) {
            newUserData.password = await bcrypt.hash(newUserData.password, 10);
            return newUserData;
         },

         async beforeUpdate(updatedUserData) {
            updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
            return updatedUserData;
         },
      },
      sequelize, // pass in our imported sequelize connection (the direct connection to our database)
      timestamps: false, // don't automatically create createdAt/updatedAt timestamp fields
      freezeTableName: true, // do NOT PLURALIZE name of database table
      underscored: true, // USE UNDERSCORES INSTEAD OF CAMEL-CASING (i.e. `comment_text` and not `commentText`)
      modelName: 'user', // make it so our model name stays lowercase in the database
   }
);

module.exports = User;
