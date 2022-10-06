const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./home-routes.js');
const dashboardRoutes = require('./dashboard-routes');

router.use('/api', apiRoutes);
router.use('/', homeRoutes);
router.use('/dashboard',dashboardRoutes);

router.use((req,res) => { //Incorrect API requests will give a 404;
    res.status(404).end();
});

module.exports = router;