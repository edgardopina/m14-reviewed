//! here we're keeping the API endpoints nice and organized while allowing the API to be scalable;  we'll add more API endpoints and 
//! use this file to collect them and give them their prefixed name. 
const router = require('express').Router();

const userRoutes = require('./user-routes.js');
router.use('/users', userRoutes); //! note we are adding '/users' here

const postRoutes = require('./post-routes.js');
router.use('/posts', postRoutes); //! note we are adding '/posts' here

module.exports = router;
