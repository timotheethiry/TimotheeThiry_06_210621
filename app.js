const express = require('express'); // importer le package express

const app = express(); // on appelle la méthode express() pour créer une app express

/* un middleware est une fonction qui reçoit et gère la requête 
et la réponse pour ensuite passer la main au middleware suivant*/

app.use((req, res, next) => { // on utilise la méthode use pour dire à l'app quoi répondre quand elle reçoit une requête
    console.log('Requête reçue !');
    next(); // on utilise la fonction next pour renvoyer la réponse et terminer la requête
});

app.use((req, res, next) => {
    res.status(201); // on peut changer le code de statut de la réponse
    next();
});

app.use((req, res, next) => {
    res.json({message: 'Votre requête a bien été reçue'}); // une fois cette réponse envoyée on ne peut pas la modifier
    next();
});

app.use((req, res) => {
    console.log('Réponse envoyée avec succès !');
});

module.exports = app; // on exporte l'app pour pouvoir y accéder depuis le reste du projet