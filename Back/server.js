// Chargement du module Express qui permet de créer un serveur web
//et de gérer les requêtes HTTP
const express = require('express');
const path = require("path");

// Création d'une instance de l'application Express
const app =  express();

app.use(express.static(path.join(__dirname, "..", "Front")));

// Définition d'une route GET pour la racine ('/')
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "..", "Front", "index.html"));
});

// Définition d'une route GET pour '/api/test'
app.get('/api/test', (req, res) => {
  res.json({ 
            message: 'API test réussie !',
            nombre: 42
   });      
});

//listen attends 2 paramètres : le port et une fonction anonyme callback
app.listen(3000,   () => {
  console.log('Serveur lancé sur http://localhost:3000');
});