const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json()); //Double check what these badboys do
app.use(express.urlencoded({ extended: true }));

//turn on routes
app.use(routes);

//turn on connextion to db and server
sequelize.sync({ force:false}).then(() => {
    app.listen(PORT, () => console.log("Now Listening"));
});