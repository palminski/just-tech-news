const router = require('express').Router();
const sequelize = require('../config/connection');
const {Post, User, Comment} = require('../models');


router.get('/',(req,res) => {
    Post.findAll({
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id','comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        //get will contert sequilize obj into more usable data
        const posts = dbPostData.map(post => post.get({ plain: true }));
        
        res.render('homepage', {posts});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
    // res.render('homepage', {
    //     id:1,
    //     post_url: 'https://handlebarsjs.com/guide/',
    //     title: 'Handlebars Docs',
    //     created_at: new Date(),
    //     vote_count: 10,
    //     comments: [{},{}],
    //     user: {
    //         username: 'palminski'
    //     }
    // });
});

module.exports = router;