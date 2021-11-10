const router = require('express').Router();
const apiRoutes = require('./api'); //! note we are collecting all under '/api'

const homeRoutes = require('./home-routes'); // get all home-routes
router.use('/', homeRoutes); // enables use of the API homeRoutes/endpoints by router

router.use('/api', apiRoutes); //! prefixing '/api' to packaged group apiRoutes  

const dashboardRoutes = require('./dashboard-routes');
router.use('/dashboard', dashboardRoutes);

//* this .use() responds to any request to any endpoint that doesn't exist, it will send a 404 error indicating
//* we have requested an incorrect resource, another RESTful API practice.
router.use((req, res) => {
   res.status(404).end();
});

//* Now when we import the routes to server.js, they'll already be packaged and ready to go with this one file!
module.exports = router;
