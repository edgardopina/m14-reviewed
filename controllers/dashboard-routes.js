const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Get main page
// NOTE the MIDDLEWARE CALL 'withAuth' AND visualize the order here.
// When withAuth() calls next(), it will call the next(anonymous) function.
// However, if withAuth() calls res.redirect(), there is no need for the next function to
//  be called, because the response has already been sent.
// router.get('/', withAuth, (req, res) => {
router.get('/', (req, res) => {
   Post.findAll({
      where: {
         user_id: req.session.user_id,
      },
      attributes: [
         'id',
         'post_url',
         'title',
         'created_at',
         [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count'],
      ],
      include: [
         {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
               model: User,
               attributes: ['username'],
            },
         },
         {
            model: User,
            attributes: ['username'],
         },
      ],
   })
      .then(dbPostData => {
         const posts = dbPostData.map(post => post.get({ plain: true })); // serialize data
         res.render('dashboard', { posts, loggedIn: true });
      })
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
});

// GET edit one post
router.get('/edit/:id', withAuth, (req, res) => {
   Post.findOne({
      where: {
         id: req.params.id,
      },
      attributes: [
         'id',
         'post_url',
         'title',
         'created_at',
         [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count'],
      ],
      include: [
         {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
               model: User,
               attributes: ['username'],
            },
         },
         {
            model: User,
            attributes: ['username'],
         },
      ],
   })
      .then(dbPostData => {
         if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
         }

         const post = dbPostData.get({ plain: true }); // serialize the data
         // pass data to template; loggedIN session variable to control what elements render and which ones not
         res.render('edit-post', {
            post,
            loggedIn: req.session.loggedIn,
         });
      })
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
});

module.exports = router;
