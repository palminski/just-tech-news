const router = require('express').Router();
const { User } = require("../../models");

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
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// PUT /api/users/1
router.put('/:id', (req,res) => {
    //if req.body has exact key value pairs you can just use rec.body
    User.update(req.body, {
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