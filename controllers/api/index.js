//! here we're keeping the API endpoints nice and organized while allowing the API to be scalable; 
//! use this file to collect all api endpoints and give them their prefixed name. 
const router = require('express').Router();

const userRoutes = require('./user-routes.js');
router.use('/users', userRoutes); //! prefixing with '/users' here

const postRoutes = require('./post-routes.js');
router.use('/posts', postRoutes); //! prefixing with '/posts' here

const commentRoutes = require('./comment-routes.js');
router.use('/comments', commentRoutes); //! prefixing with '/comments' here

module.exports = router;
