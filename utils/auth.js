//! defines function as normall callback, checks for existence of req.session.user_id, if it exists calls next() 
function withAuth(req, res, next) {
   if (!req.session.user_id) {
      res.redirect('/login');
   } else {
      next();
   }
}

module.exports = withAuth;
