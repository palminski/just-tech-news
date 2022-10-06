const router = require('express').Router();
const sequelize = require('../config/connection');
const {Post, User, Comment} = require('../models');

router.get('/',(req,res) => {
    Post.findAll({
        where: {
            //use session ID
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        //serialize data before passing it to template
        const posts = dbPostData.map(post => post.get({plain: true}));
        res.render('dashboard',{posts, loggedIn: true});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


module.exports = router;
