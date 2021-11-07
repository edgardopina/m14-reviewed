const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Comment extends Model {}

Comment.init(
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
         allowNull: false,
      },
      comment_text: {
         type: DataTypes.STRING,
         allowNull: false,
         validate: {
            len: [1], // comment must be at least one characters long
         },
      },
      user_id: {
         type: DataTypes.INTEGER,
         references: {
            model: 'user',
            key: 'id',
         },
      },
      post_id: {
         type: DataTypes.INTEGER,
         references: {
            model: 'post',
            key: 'id',
         },
      },
   },
   {
      sequelize,
      freezeTableName: true,
      underscored: true,
      modelName: 'comment',
   }
);

module.exports = Comment;

