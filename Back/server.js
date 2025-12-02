//chargement du module expresse qui permet de créer un serveur web
//et de gérer les requêtes HTTP
const express = require('express');

//création d'une instance de l'application express
const app = express();

//définition d'une route get pour la racine ('/')
app.get('/', (req, res) => {
    res.send('Hello World!');
});

//Listen attends 2 paramètres : le port d'écoute et une fonction anonyme de rappel
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

