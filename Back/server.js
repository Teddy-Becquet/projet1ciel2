// Chargement du module Express qui permet de créer un serveur web
//et de gérer les requêtes HTTP
const express = require('express');
const path = require("path");
const jwt = require("jsonwebtoken");
//création d'une clé secrète pour le JWT
const JWT_SECRET = "A mettre dans le .env";


//Middleware pour vérifier une token JWT
// 👉 Middleware pour vérifier le token
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  // Format attendu : "Bearer TOKEN"
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Token manquant" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // on stocke les infos dans req.user
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token invalide" });
  }
}


// Création d'une instance de l'application Express
const app =  express();


app.use(express.static(path.join(__dirname, "..", "Front")));

// Définition d'une route GET pour la racine ('/')
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "..", "Front", "index.html"));
});

// Définition d'une route GET pour '/api/test'
app.get('/api/test', authMiddleware,(req, res) => {
  res.json({ 
            message: 'Message secret ',
   });      
});

app.post('/api/login', express.json(), (req, res) => {
    const { login, password } = req.body;
    console.log(`Login reçu : ${login}, Password reçu : ${password}`); 
    //créeer un token JWT
    const token = jwt.sign({ login }, JWT_SECRET, { expiresIn: '4h' });
    console.log(`Token JWT généré : ${token}`); 
    res.json({ message: "Vous etes connecté", token : token });
});

//listen attends 2 paramètres : le port et une fonction anonyme callback
app.listen(3000,   () => {
  console.log('Serveur lancé sur http://172.29.18.254:3000');
});