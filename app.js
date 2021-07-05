const express = require('express'); // importer le package express
const bodyParser = require('body-parser');
const Sauce = require('./models/sauce');
const User = require('./models/user');
const user = require('./models/user');

const app = express(); // on appelle la méthode express() pour créer une app express

/* app.use write middleware for CORS issues */

/* extrait le body de la demande en json et le transforme en objet JS*/
app.use(bodyParser.json());


/* create a user account */
app.post('/api/auth/signup', (req, res, next) => {
    user = new User ({
        ...req.body
    });
    user.save()
    .then(() => res.status(201).json({ message: 'User account created !' }))
    .catch(error => res.status(400).json({ error }));
});

/* authentify a user */
app.post('/api/auth/login', (req, res, next) => {
    User.findOne({ email: req.body.email, password: req.body.password  })
    .then(() => res.status(200).json({ userId: '', token: '' }))
    .catch(error => res.status(400).json({ error }));
});

/* create a sauce */
app.post('/api/sauces', (req, res, next) => {
    sauce = new Sauce ({
        ...req.body
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'New sauce created !' }))
    .catch(error => res.status(400).json({ error }));
});

/* like a sauce */
app.post('/api/sauces/:id/like', (req, res, next) => {
    sauce.findOne({ _id: req.params.id })
    .then(() => res.status(201).json({ message: 'Preferences saved !' }))
    .catch(error => res.status(400).json({ error }));
});

/* modify likes */
app.put('/api/sauces/:id/like', (req, res, next) => {
    sauce.updateOne({ _id: req.params.id }, { userLiked: req.body.userId, userDisliked: req.body.userId, likes: req.body.likes })
    .then(() => res.status(200).json({ message: 'Preferences updated !' }))
    .catch(error => res.status(400).json({ error }));
});

/* modify a sauce */
app.put('/api/sauces/:id', (req, res, next) => {
    sauce.updateOne({ _id: req.params.id }, { ...req.body })
    .then(() => res.status(200).json({ message: 'Sauce modified !' }))
    .catch(error => res.status(400).json({ error }));
});

/* get one sauce */
app.get('/api/sauces/:id', (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
});

/* get all sauces */
app.get('/api/sauces', (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(404).json({ error }));
});

app.use((req, res) => {
    console.log('Réponse envoyée avec succès !');
});

module.exports = app; // on exporte l'app pour pouvoir y accéder depuis le reste du projet