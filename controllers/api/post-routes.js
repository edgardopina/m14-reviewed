const router = require('express').Router();
const sequelize = require('../../config/connection');
const { User, Post, Vote, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// GET /api/posts - GETT ALL POSTS
router.get('/', (req, res) => {
   Post.findAll({
      attributes: [
         'id',
         'post_url',
         'title',
         'created_at',
         //! add count of votes per post         
         [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count'],
      ],
      order: [['created_at', 'DESC']], // NEWEST POSTS AT THE TOP
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
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
});

// GET /api/posts/1 - GET ONE POST
router.get('/:id', (req, res) => {
   // data received through req.params.id
   Post.findOne({
      where: {
         id: req.params.id,
      },
      attributes: [
         'id',
         'post_url',
         'title',
         'created_at',
         /*
         ! add count of votes per post         
         */
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
            res.status(404).json({ message: 'No user found with this id' });
            return;
         }
         res.json(dbPostData);
      })
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
});

// POST /api/posts - CREATE ONE POST
// router.post('/', withAuth, (req, res) => {
router.post('/',  (req, res) => {
   console.log('req.body', req.body);
   Post.create({
      // title: req.body.post_title,
      title: req.body.title,
      post_url: req.body.post_url,
      // user_id: req.session.user_id,
      user_id: req.body.user_id,
   })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
});

// PUT /api/posts/upvote 
//! when we vote on a post, we are technically uopdating the post's data 
//! THIS ROUTE MUST BE PLACED BEFORE THE '/:id' ROUTE BELOW, OTHERWISE, EXPRESS.JS WILL THINK THAT THE
//! WORD 'upvote' IS A VALID PARAMETER FOR '/:id' 
router.put('/upvote', withAuth, (req, res) => {
   // make sure that the session exists first, then if a session does exist, we're using the saved user_id
   // property on the session to insert a new record in the vote table.
   if (req.session) {
      //pass session id along with all destructured properties on req.body
      Post.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
         .then(updatedVoteData => res.json(updatedVoteData))
         .catch(err => {
            console.log(err);
            res.status(500).json(err);
         });
   }
});

// PUT /api/posts/1 - UPDATE ONE POST
// data received through req.body and we use req.params.id to ndicate where exactly we want
// the new data to be used.
// IF req.body has exact key/value pairs to match the model, you can just use `req.body` instead
// router.put('/:id', withAuth, (req, res) => {
router.put('/:id', (req, res) => {
   // data received through req.params.id
   Post.update({
         title: req.body.title,
      }, {
         where: {
            id: req.params.id,
         },
      }
   )
      .then(dbPostData => {
         if (!dbPostData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
         }
         res.json(dbPostData);
      })
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
});

// DELETE /api/posts/1 - DELETE ONE POST
// router.delete('/:id', withAuth, (req, res) => {
router.delete('/:id', (req, res) => {
   Post.destroy({
      where: {
         id: req.params.id,
      },
   })
      .then(dbPostData => {
         if (!dbPostData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
         }
         res.json(dbPostData);
      })
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
});

module.exports = router;