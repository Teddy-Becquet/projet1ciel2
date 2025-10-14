//Serveur node js  pour se connecter a la base de donnée 
const express = require('express');// pour créer le serveur
const mongoose = require('mongoose');// pour se connecter a la BDD 
const bodyParser = require('body-parser');// pour parser les requetes
const cors = require('cors');// pour autoriser les requetes cross-origin
const app = express();// initialisation de l'application express
const port = 8080;// port d'écoute du serveur
require('dotenv').config();// pour charger les variables d'environnement depuis un fichier .env
module.exports = app;

//vérifier la connection a la bdd
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à la base de données réussie'))
    .catch(err => console.error('Échec de la connexion à la base de données', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    res.send('Serveur en cours d\'exécution');
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${8080}`);
})
// Pour tester la connection au serveur : http://172.29.18.254/phpmyadmin/
fetch('http://172.29.18.254/phpmyadmin/')
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Erreur:', error));

//tester la route de la bdd
app.get('/test-db', (req, res) => {
    res.send('Test de la route de la base de données');
});

//
