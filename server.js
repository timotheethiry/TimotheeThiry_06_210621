const http = require('http'); // importer le package http de node
const app = require('./app'); // importer notre application express

const normalizePort = val => { // cette fonction renvoit un port valide sous la forme d'un nombre ou d'une string
    const port = parseInt(val, 10); // val est transformé en un nombre entier de base 10

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}

const port = normalizePort(process.env.PORT || '3000' ); /* si le port 3000 n'est pas disponible, 
on utilise une variable environnement si un port par défaut est proposé */

app.set('port', port); // configure le port sur lequel l'app va tourner, on dit qu'on set le port

const errorHandler = error => { // on recherche et gère les différentes erreurs
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address(); // appelle l'adresse du server http
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port; // on assigne à bind l'adresse du canal ou le port utilisé
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevate privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = http.createServer(app); /* package http permet de créer un server, l'argument est la fonction appellée pour chaque requête,
ici on appelle notre app */

server.on('error', errorHandler); // on écoute si une erreur survient
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});


server.listen(port); // le server est prêt et doit maintenant attendre les requête

