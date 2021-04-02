const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');

// homepage
router.get('/', (req,res) => {
    Post.findAll({
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
            }
        ]
    }).then(data => {
        const posts = data.map(post => post.get({ plain: true }));
        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn
          });
    }).catch(err => {
        console.log(err);
        res.status(404).json(err);
    });
});

// profile page
router.get('/profile', (req,res) => {
    res.render("profile");
});

// login page
router.get('/login', (req,res) => {
    res.render("login");
});

// singup page
router.get('/signup', (req,res) => {
    res.render("signup");
});
// single post
router.get('/post/:id', (req,res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: ['comment_text', 'user_id', 'post_id', 'created_at'],
                include: [
                    {
                        model: User,
                        attributes: ['username']
                    }
                ]
            }
        ]
    }).then(data => {
        const posts = data.get({ plain: true });
        res.render('single-post', {
            posts,
            user_id: req.session.user_id,
            loggedIn: req.session.loggedIn
        });
    }).catch(err => {
        console.log(err);
        res.status(404).json(err);
    });
});





module.exports = router;