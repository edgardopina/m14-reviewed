const router = require('express').Router();
// const { User, Post, Vote, Comment } = require('../../models');
const { User } = require('../../models');
const withAuth = require('../../utils/auth');

//! the following endpoints will be accessible at the /api/users post_url
//! using /api/users, /api/posts, /api/comment, etc. naming convention, and using the GET, POST, PUT, DELETE
//! methods, and using the proper HTTP status codes like 400,404, 500, etc. follows the architectural pattern
//! called REST.APIs built following this pattern can be accessed are called RESTful APIs

//! GET /api/users - READ ALL USERS
router.get('/', (req, res) => {
   User.findAll({
      // attributes: { exclude: ['password'] },
   })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
});

//! GET /api/users/1 - READ ONE USER
router.get('/:id', (req, res) => {
   User.findOne({
      where: {
         id: req.params.id,
      },
      // attributes: { exclude: ['password'] },
      // include: [
      //    {
      //       model: Post,
      //       attributes: ['id', 'title', 'post_url', 'created_at'],
      //    },
      //    {
      //       model: Comment,
      //       attributes: ['id', 'comment_text', 'created_at'],
      //       include: {
      //          model: Post,
      //          attributes: ['title'],
      //       },
      //    },
      //    {
      //       model: Post,
      //       attributes: ['title'],
      //       through: Vote,
      //       as: 'voted_posts',
      //    },
      // ],
   })
      .then(dbUserData => {
         if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
         }
         res.json(dbUserData);
      })
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
});

//! POST /api/users - CREATE AN USER
router.post('/', (req, res) => {
   User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
   })
      .then(dbUserData => {
         //* give the server access to the user's user_id and username, and a boolean describing IF the user is logged in.
         //* the session must BE created before we send the response back, so we're wrapping the variables in a callback.
         //* the req.session.save() method will INITIATE THE CREATION OF THE SESSION and then run the callback function once complete.
         // req.session.save(() => {
         //    req.session.user_id = dbUserData.id;
         //    req.session.username = dbUserData.username;
         //    req.session.loggedIn = true;
         //    res.json(dbUserData); //! callback function
         // });
         res.json(dbUserData); //! callback function
      })
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
});

//! POST /api/users/login - we use POST method because it carries the request parameter in req.body which is more secure than
//! using the  GET method as it carries the request parameter appended to the URL string (not safe)
router.post('/login', (req, res) => {
   User.findOne({
      where: {
         email: req.body.email,
      },
   }).then(dbUserData => {
      if (!dbUserData) {
         res.status(404).json({ message: 'No user found with that email address!' });
         return;
      }

      // verify user
      const validPassword = dbUserData.checkPassword(req.body.password);
      if (!validPassword) {
         res.status(400).json({ message: 'Incorrect password!' });
         return;
      }

      // res.json({ user: dbUserData, message: 'You are now logged in!' });
      // added session variables
      // req.session.save(() => {
      //    req.session.user_id = dbUserData.id;
      //    req.session.username = dbUserData.username;
      //    req.session.loggedIn = true;
      //    // callback
      //    res.json({user: dbUserData, message: 'You are now logged in!'});
      // });
      res.json({ user: dbUserData, message: 'You are now logged in!' });
   });
});

// POST /api/users/logout
router.post('/logout', (req, res) => {
   if (req.session.loggedIn) {
      req.session.destroy(() => {
         res.status(204).end();
      });
   } else {
      res.status(404).end();
   }
});

// PUT /api/users/1 - UPDATE ONE USER
// router.put('/:id', withAuth, (req, res) => {
router.put('/:id', (req, res) => {
   User.update(req.body, {
      individualHooks: true, // paired with beforeUpdate() hook in User.js
      where: {
         id: req.params.id,
      },
   })
      .then(dbUserData => {
         // dbUserData[0] is the first element of the response Array, the id
         if (!dbUserData[0]) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
         }
         res.json(dbUserData);
      })
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
});

// DELETE /api/users/1 - DELETE ONE USER
// router.delete('/:id', withAuth, (req, res) => {
router.delete('/:id', (req, res) => {
   User.destroy({
      where: {
         id: req.params.id,
      },
   })
      .then(dbUserData => {
         // dbUserData[0] is the first element of the response Array, the id
         if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
         }
         res.json(dbUserData);
      })
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
});

module.exports = router;
