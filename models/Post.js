const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// creates the Post model (table)
class Post extends Model {
   //!  static keyword to indicate that the upvote method is one that's based on the Post model and not an instance method
   static upvote(body, models) {
      return (
         //! content of models: models { Vote: vote }; therefore models.Vote.create() works and there is no need for require
         models.Vote.create({
            user_id: body.user_id,
            post_id: body.post_id,
         })
            // .then(dbPostData => res.json(dbPostData))
            .then(() => {
               // then find the post we just voted for
               return Post.findOne({
                  where: {
                     id: body.post_id,
                  },
                  attributes: [
                     'id',
                     'post_url',
                     'title',
                     'created_at',
                     //! use raw MySQL aggregate function query to get count of how many votes the post has
                     //! and return it under the name 'vote_count'
                     //! NOTE THE ARRAY SYNTAX TO CALL 'sequelize.literal()'
                     //! IF we were not counting an associated table but rather the post itself, we could have used
                     //! sequelize.findAndCountAll() method - bummer :(
                     [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count'],
                  ],
               });
            })
      );
   }
}

// creates fields/columns for Post model (table) - the schema
// this is the equivalent of the sql FOREIGN KEY; however, sequelize need an explicit definition of the relationship
// by using the User.hasMany() method in the index.js file under './models/'
Post.init(
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
         allowNull: false,
      },
      title: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      post_url: {
         type: DataTypes.STRING,
         allowNull: false,
         validate: {
            isUrl: true,
         },
      },
      user_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: 'user',
            key: 'id',
         },
      },
   },
   {
      sequelize,
      freezeTableName: true,
      underscored: true,
      modelName: 'post',
   }
);

module.exports = Post;
