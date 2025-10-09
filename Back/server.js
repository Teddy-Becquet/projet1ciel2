//Déclaration de constantes & des paramètres du serveur
const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser'); // Ajout de cookie-parser
const cooking = require('cooking');
const { request } = require('http');
const { response } = require('express');
const { json } = require('express');
const { urlencoded } = require('express');
const { use } = require('express');
const process = require('process');
const { Console } = require('console');
const { error } = require('console');
const rateLimit = require('express-rate-limit');
const bodyParser = require("body-parser");
const port = 9100; 
const app = express();
 
// Limite de requêtes pour éviter le spam (5 requêtes max par 2 minutes par IP)
const limiter = rateLimit({
    windowMs: 1 * 120 * 10000, // 2 minutes
    max: 25,
    message: "hahahahah!!!! Trop de tentatives. Réessayez plus tard.",
});

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(express.json());
app.use(limiter); // Appliquer à toutes les routes

// Middleware d'authentification
function authenticateToken(req, res, next) {
    const token = req.cookies.token; // Récupérer le token depuis les cookies
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

//Connexion à la base de données
const bddConnection = mysql.createConnection({
    host: '172.29.18.254',
    user: 'root',
    password: 'root',
    database: 'Lawrence'
});

bddConnection.connect(function (err) {
    if (err) throw err;
    console.log("Vous êtes enfin connecté sur le serveur !");
});

// Route à emprunter dans le navigateur
app.get('/', (req, res) => {
    res.json('Bonjour, ceci est notre serveur (back-end), soyez les bienvenus ! ajouter un /accueil dans URL pour accéder à la page d\'accueil');
});

// Route pour l'inscription
app.post('/inscription', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = { username: req.body.username, password: hashedPassword };
        bddConnection.query('SELECT * FROM users WHERE user_name = ?', [username], async function (err, rows) {
            if (err) throw err;
            res.status(201).send('Utilisateur enregistré');
        });
    } catch {
        res.status(500).json();
    }
});

// Route pour la connexion
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    bddConnection.query('SELECT * FROM users WHERE username = ?', [username], async function (err, rows) {
        if (err) throw err;
        if (rows.length === 0) return res.status(400).send('Utilisateur non trouvé');
        try {
            if (await bcrypt.compare(password, rows[0].password)) {
                const user = { name: username };
                const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
                res.cookie('token', accessToken, { httpOnly: true }); // Stocker le token dans un cookie
                res.json({ accessToken: accessToken });
            } else {
                res.json('Mot de passe incorrect'); // ici j'ai changé le status en "send" en json
            }
        } catch {
            res.status(500).send();
        }
    });
});

// Route sécurisée pour l'ajout d'admin avec hachage du mot de passe
app.post('/admin/connexion', async (req, res) => {
    const { nom, mdp } = req.body;

    if (!nom || !mdp) {
        return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    try {
        const hashedmdp = await bcrypt.hash(mdp, 10); // Hachage du mot de passe

        const query = "INSERT INTO Admin (nom, mdp) VALUES (?, ?)";
        bddConnection.query(query, [nom, hashedmdp], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Erreur lors de l'ajout de l'admin" });
            }
            res.status(201).json({ message: "Admin ajouté avec succès !" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors du hachage du mot de passe" });
    }
});

// Route GET pour récupérer les utilisateurs
app.get('/admin/users', (req, res) => {
    const sql = "SELECT * FROM utilisateurs";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Erreur lors de la récupération des utilisateurs :", err);
            return res.status(500).json({ message: "Erreur serveur" });
        }
        res.status(200).json(result);
    });
});

// Route POST pour insérer un utilisateur
app.post('/admin/users', (req, res) => {
    const { id, nom, prenom, mdp } = req.body;

    if (!id || !nom || !prenom || !mdp) {
        return res.status(400).json({ message: "Données manquantes" });
    }

    const sql = "INSERT INTO utilisateurs (id, nom, prenom, mdp) VALUES (?, ?, ?, ?)";
    db.query(sql, [id, nom, prenom, mdp], (err, result) => {
        if (err) {
            console.error("Erreur lors de l'insertion :", err);
            return res.status(500).json({ message: "Erreur serveur" });
        }
        res.status(201).json({ message: "Utilisateur ajouté !" });
    });
});

// Route GET pour récupérer un utilisateur par ID
app.get('/admin/users/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM utilisateurs WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Erreur lors de la récupération de l'utilisateur :", err);
            return res.status(500).json({ message: "Erreur serveur" });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.status(200).json(result[0]);
    });
});

// Route PUT pour mettre à jour un utilisateur
app.put('/admin/users/:id', (req, res) => {
    const id = req.params.id;
    const { nom, prenom, mdp } = req.body;

    const sql = "UPDATE utilisateurs SET nom = ?, prenom = ?, mdp = ? WHERE id = ?";
    db.query(sql, [nom, prenom, mdp, id], (err, result) => {
        if (err) {
            console.error("Erreur lors de la mise à jour de l'utilisateur :", err);
            return res.status(500).json({ message: "Erreur serveur" });
        }
        res.status(200).json({ message: "Utilisateur mis à jour !" });
    });
});

// Route DELETE pour supprimer un utilisateur
app.delete('/admin/users/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM utilisateurs WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Erreur lors de la suppression de l'utilisateur :", err);
            return res.status(500).json({ message: "Erreur serveur" });
        }
        res.status(200).json({ message: "Utilisateur supprimé !" });
    });
});

// Route pour la page d'accueil = page.html (protégée)
app.get('/page', authenticateToken, (req, res) => {
    res.json('Vous êtes dans la page d\'accueil. Soyez les bienvenus sur cette page');
});


// Démarrer le serveur
app.listen(port, () => {
    console.log(`Le serveur est en écoute sur le port ${port}`);
});