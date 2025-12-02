//chargement du module expresse qui permet de créer un serveur web
//et de gérer les requêtes HTTP
const express = require('express');
const path = require('path');

//création d'une instance de l'application express
const app = express();

app.use(express.static(path.join(__dirname, "..", "Front")));

//définition d'une route get pour la racine ('/')
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "..", "Front", "index.html"));
});

//Listen attends 2 paramètres : le port d'écoute et une fonction anonyme de rappel
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

