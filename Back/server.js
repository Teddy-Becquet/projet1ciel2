//Serveur node js  pour se connecter a la base de donnée 
import express from 'express';
const port = 7032;
import mysql from 'mysql';
import fetch from 'node-fetch';


//vérifier la connection a la bdd
mysql.bdd(process.env.mysqlI, { useNewUrlParser: true, useUnifiedTopology: true })// connection a la bdd
    .then(() => console.log('Connexion à la base de données réussie'))// message si la connection a la bdd est réussie
    .catch(err => console.error('Échec de la connexion à la base de données', err));// message si la connection a la bdd échoue

// Routes
app.get('/', (req, res) => {
    res.send('Serveur en cours d\'exécution');// message pour indiquer que le serveur fonctionne
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${7032}`);// message pour indiquer que le serveur a démarré sur le port 7032
})
// Pour tester la connection a la bdd : http://172.29.18.254/phpmyadmin/
fetch('http://172.29.18.254/phpmyadmin/')
    .then(response => response.text())// recupere la reponse de la bdd
    .then(data => console.log(data))// affiche la reponse de la bdd
    .catch(error => console.error('Erreur:', error));// affiche l'erreur si la connection a la bdd echoue

//tester la route de la bdd
app.get('http://172.29.18.254/phpmyadmin/', (req, res) => {// l'url pour tester la route de la bdd
    //vérifier que la route de la bdd fonctionne
    res.send('Test de la route de la base de données'); // message pour indiquer que la route de la bdd fonctionne
});
//tester que le serveur fonctionne
app.get('http://172.29.18.254/projet1ciel2/back/server.js', (req, res) => {
    //vérifier que la route du serveur fonctionne
    res.send('Test de la route du serveur');// message pour indiquer que la route du serveur fonctionne
});

// Pour tester la connection au serveur : http://172.29.18.254/Pojet1ciel2/back/server.js
fetch('http://172.29.18.254/Pojet1ciel2/back/server.js')
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Erreur:', error));

// tester la route de la page de connection
app.get('/login', (req, res) => {
    res.send('Test de la route de la page de connection');
});

// Pour tester la route de la page de connection : http://172.29.18.254/Pojet1ciel2/front/html/creation.html
fetch('http://172.29.18.254/Pojet1ciel2/front/html/creation.html')
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Erreur:', error));

    //tester la route de la page de creation de compte
app.get('/creation', (req, res) => {
    res.send('Test de la route de la page de creation de compte');
});

// Pour tester la route de la page de creation de compte : http://172.29.18.254/Pojet1ciel2/front/html/index.html
fetch('http://172.29.18.254/Pojet1ciel2/front/html/index.html')
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Erreur:', error));

//tester node server.js
fetch('http://172.29.18.254/Pojet1ciel2/front/html/index.html')
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Erreur:', error));