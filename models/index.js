const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');
const Comment = require('./Comment');


//! REMEMBER: EACH TIME WE UPDATE THE RELATIONSHIPS (ASSOCIATIONS) between the tables, we need to use 
//! sequelize.sync({ force: true }) in server.js to drop the tables and recreate them!

User.hasMany(Post, {
   foreignKey: 'user_id',
});

//! AND WE ALSO NEED TO MAKE THE REVERSE ASSOCIATION: a post can belong to one user but not many iusers
Post.belongsTo(User, {
   foreignKey: 'user_id',
   onDelete: 'SET NULL',
});

User.belongsToMany(Post, {
   through: Vote,
   as: 'voted_posts',
   foreignKey: 'user_id',
   onDelete: 'SET NULL',
});

Post.belongsToMany(User, {
   through: Vote,
   as: 'voted_posts',
   foreignKey: 'post_id',
   onDelete: 'SET NULL',
});

Vote.belongsTo(User, {
   foreignKey: 'user_id',
   onDelete: 'SET NULL',
});

// ONE-TO-ONE
Vote.belongsTo(Post, {
   foreignKey: 'post_id',
   onDelete: 'SET NULL',
});

// By also creating one-to-many associations directly between these models, we can perform aggregated SQL
// functions between models.In this case, we'll see a total count of votes for a single post when queried.
// This would be difficult if we hadn't directly associated the Vote model with the other two.

User.hasMany(Vote, {
   foreignKey: 'user_id',
});

// ONE-TO-MANY
Post.hasMany(Vote, {
   foreignKey: 'post_id',
});


Comment.belongsTo(User, {
   foreignKey: 'user_id',
   onDelete: 'SET NULL',
});

Comment.belongsTo(Post, {
   foreignKey: 'post_id',
   onDelete: 'SET NULL',
});

User.hasMany(Comment, {
   foreignKey: 'user_id',
   onDelete: 'SET NULL',
});

Post.hasMany(Comment, {
   foreignKey: 'post_id',
});

module.exports = { User, Post, Vote, Comment };
