const router = require('express').Router();
const {Post, User} = require('../../models');

// get all posts
router.get('/',(req,res) => {
    console.log('=============================');
    Post.findAll({
        //query config
        attributes: ['id', 'post_url', 'title', 'created_at'],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//get 1 user
router.get('/:id', (req,res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes:['id', 'post_url', 'title', 'created_at'],
        include: [{
            model: User,
            attributes: ['username']
        }]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: "No post found with this id"});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

//make a post
router.post('/', (req,res) => {
   
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//put change title
router.put('/:id', (req, res) => {

    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: "Uh Oh! There was no data found for this API requiest. While the problem could be on our end, let's be honest. It's more likely your fault. Are you sure you typed your request properly? Double check the ID or spelling." });
                return;
            }
            res.json(dbPostData)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//delete Post
router.delete('/:id', (req, res) => {
    Post.destroy(
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this ID'});
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