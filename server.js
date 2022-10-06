const path = require('path');
const express = require('express');
const routes = require('./controllers/');
const sequelize = require('./config/connection');
const session = require('express-session');
const helpers = require('./utils/helpers');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: 'Super secret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};



const app = express();
const PORT = process.env.PORT || 3001;

//session
app.use(session(sess));

//For Handlebars
const exphbs = require('express-handlebars');
const hbs = exphbs.create({ helpers });


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');



//allows the public forlder to be used
app.use(express.static(path.join(__dirname,'public')));

app.use(express.json()); //Double check what these badboys do
app.use(express.urlencoded({ extended: true }));

//turn on routes
app.use(routes);

//turn on connextion to db and server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log("Now Listening"));
});