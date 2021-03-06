const router = require('express').Router();
const sequelize = require('../../config/connection');
const { User, Post, Comment, Vote } = require('../../models');

// get all posts
router.get('/', (req,res) => {
    Post.findAll({
        attributes: [
            'id',
            'artist',
            'album_title',
            'genre',
            'year',
            'format',
            'photo_url',
            'description',
            'createdAt',
            'updatedAt',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['comment_text', 'user_id', 'post_id', 'created_at'
            ],
                include: [
                    {
                        model: User,
                        attributes: ['username']
                    }
                ]
            },
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Vote,
                attributes: ['user_id', 'post_id']
            }
        ]
    }).then(data => res.json(data)).catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
});
// get one post
router.get('/:id', (req,res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'artist',
            'album_title',
            'genre',
            'year',
            'format',
            'photo_url',
            'description',
            'createdAt',
            'updatedAt',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['comment_text', 'user_id', 'post_id', 'created_at'],
                include: [
                    {
                        model: User,
                        attributes: ['username']
                    }
                ]
            },
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Vote,
                attributes: ['user_id', 'post_id']
            }
        ]
    }).then(data => res.json(data)).catch(err => {
        console.log(err);
        res.status(400).json(err);
    })
});
// create post
router.post('/', (req,res) => {
    Post.create({
        artist: req.body.artist,
        album_title: req.body.album_title,
        genre: req.body.genre,
        year: req.body.year,
        format: req.body.format,
        photo_url: req.body.photo_url,
        description: req.body.description,
        user_id: req.session.user_id
    }).then(data => res.json(data)).catch(err => {
        console.log(err);
        res.status(404).json(err);
    })
});
// PUT /api/posts/upvote
router.put('/upvote', (req, res) => {
    // make sure the session exists first
    if (req.session) {
      // pass session id along with all destructured properties on req.body
      Post.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
        .then(updatedVoteData => res.json(updatedVoteData))
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
    }
  });
// update post
router.put('/:id', (req,res) => {
    Post.update(req.body, {
        where: {
            id: req.params.id
        }
    }).then(data => res.json(data)).catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
});
router.delete('/upvote', (req, res) => {
    const post_id = req.query.post_id;
    // make sure the session exists first
    if (req.session) {
      // pass session id along with all destructured properties on req.body
      Post.downvote({user_id: req.session.user_id, post_id: post_id}, { Vote, Comment, User })
        .then(updatedVoteData => res.json(updatedVoteData))
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
    }
  });
// delete post
router.delete('/:id', (req,res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    }).then(data => res.json(data)).catch(err => {
        console.log(err);
        res.status(400).json(err);
    })
});



module.exports = router;