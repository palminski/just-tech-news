const router = require('express').Router();
const { User, Post, Vote, Comment } = require("../../models");

//REST
//Representational State Transfer

//GET /api/users
router.get('/', (req,res) => {
    // access our user model and run .findAll() method
    User.findAll({
        attributes: { exclude: ['password'] }
        })
    .then(dbUserData => res.json(dbUserData))
    .catch( err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//GET /api/users/1
router.get('/:id', (req,res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        include: [
            {
                model: Post,
                attributes: ['id','title','post_url','created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            },
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            }
        ],
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: "Uh Oh! There was no data found for this API requiest. While the problem could be on our end, let's be honest. It's more likely your fault. Are you sure you typed your request properly? Double check the ID or spelling."});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


//POST /api/users
router.post('/', (req,res) => {
    //expects {username, email, and password} what we define in User model
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => {
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

          res.json(dbUserData);  
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//POST /api/users/login
router.post('/login', (req,res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message:"No user with that email adress exits" });
            return;
        }

        const validPassword = dbUserData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({message: 'incorrect password!'});
            return;
        }

        req.session.save(() => {
            // declare session variables
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: 'You are now logged in!'});
        });
    });
});

//Logout
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    }
    else {
        res.status(404).end();
    }
});

// PUT /api/users/1
router.put('/:id', (req,res) => {
    //if req.body has exact key value pairs you can just use rec.body
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData[0]) {
            res.status(404).json({message: "Uh Oh! There was no data found for this API requiest. While the problem could be on our end, let's be honest. It's more likely your fault. Are you sure you typed your request properly? Double check the ID or spelling."});
            return ;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Delete /api/users/1
router.delete('/:id', (req,res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: "Uh Oh! There was no data found for this API requiest. While the problem could be on our end, let's be honest. It's more likely your fault. Are you sure you typed your request properly? Double check the ID or spelling."});
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