const express = require('express'); // importer le package express
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

/* import the sauces and user CRUD router */
const saucesRoutes = require('./routes/sauces');

const app = express(); // on appelle la méthode express() pour créer une app express
mongoose.connect('mongodb+srv://OCP6-admin:LOXoZDBFG1sIt5UX@ocp6-backend.5pkum.mongodb.net/piquante?retryWrites=true&w=majority',
{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB !'))
.catch(() => console.log('Connexion to MongoDB failed !'));


/* app.use write middleware for CORS issues */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

/* extrait le body de la demande en json et le transforme en objet JS*/
app.use(bodyParser.json());

/* use the sauces router for all of the requests */
app.use('/api/sauces', saucesRoutes);

module.exports = app; // on exporte l'app pour pouvoir y accéder depuis le reste du projet