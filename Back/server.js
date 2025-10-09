//Serveur node js  pour se connecter a la base de donnée 
const express = require('express');// pour créer le serveur
const mongoose = require('mongoose');// pour se connecter a la BDD 
const bodyParser = require('body-parser');// pour parser les requetes
const cors = require('cors');// pour autoriser les requetes cross-origin
const app = express();// initialisation de l'application express
const port = 8080;// port d'écoute du serveur
require('dotenv').config();// pour charger les variables d'environnement depuis un fichier .env

// Middleware
app.use(bodyParser.json());// pour parser les requetes en json
app.use(cors());// pour autoriser les requetes cross-origin

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// Routes
app.get('/', (req, res) => {
    res.send('Hellow World!');// route de test
});
// Démarrage du serveur
app.listen(port, () => {
    console.log(`Server is running on http://172.29.18.254${8080}`);// message de confirmation
});
// Exporter l'application pour les teste
module.exports = app;

