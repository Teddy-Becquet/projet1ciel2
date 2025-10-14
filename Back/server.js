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
mongoose.connect(process.env.bdd, { useNewUrlParser: true, useUnifiedTopology: true })// connexion a la BDD
    .then(() => console.log('Connected to bdd'))// message de confirmation
    .catch(err => console.error('Could not connect to bdd...', err));// message de confirmation ou d'erreur

// Routes
app.get('/', (req, res) => {
    res.send('Hellow World!');// route de test
});
// Démarrage du serveur
app.listen(port, () => {
    console.log(`Server is running on http://172.29.18.254`);// message de confirmation
});
// Exporter l'application pour les teste
module.exports = app;

//teste
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running on http://172.29.18.254`);
    });
}

//login.js — front-end avec compte root
(function() {
    const DEMO_USER = { username: 'root', password: 'root' };
    const SESSION_KEY = '';

    function showError(msg) {
        const el = document.getElementById('error');
        el.textContent = msg || 'root';
    }

    function setSession(username) {
        const token = btoa(JSON.stringify({ user: username, iat: Date.now() }));
        localStorage.setItem(SESSION_KEY, token);
    }

    // Remplir automatiquement les champs avec le compte 
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'fill-root') {
            document.getElementById('username').value = root.username;
            document.getElementById('password').value = root.password;
        }
    });
})