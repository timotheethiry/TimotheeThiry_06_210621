const express = require('express'); // importer le package express
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

/* import the sauces and user CRUD router */
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

/* create an express app and link it to a mongoDB database */
const app = express();
mongoose.connect('mongodb+srv://OCP6-aqw:JkhaDTX65KmnhEdM@ocp6-backend.5pkum.mongodb.net/piquante?retryWrites=true&w=majority',
{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB !'))
.catch(() => console.log('Connexion to MongoDB failed !'));


/* app.use write middleware for CORS issues */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

/* extrait le body de la demande en json et le transforme en objet JS*/
app.use(bodyParser.json());

/* get the images in the server to respond to the corresponding GET requests */
app.use('/images', express.static(path.join(__dirname, 'images')));

/* use the routers for sauce and authentification requests */
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app; // on exporte l'app pour pouvoir y accéder depuis le reste du projet