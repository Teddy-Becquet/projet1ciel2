//route vers la bdd phpmyadmin
function goToPhpMyAdmin() {
    window.location.href = "http://172.29.18.254/phpmyadmin/"; // redirection vers la bdd
}

//route vers la page de creation de compte
function goToCreationPage() {
    window.location.href = "http://172.29.18.254/projet1ciel2/front/html/creation.html;" // redirection vers la page de creation de compte
}

//route vers la page de connection
function goToLoginPage() {
    window.location.href = "http://172.29.18.254/projet1ciel2/front/html/index.html;" // redirection vers la page de connection
};

//vérifier la connection a la bdd
function verifyDatabaseConnection() {
    fetch('http://172.29.18.254/phpmyadmin/') // URL de l'API pour vérifier la connexion à la base de données
        .then(response => {
            if (response.ok) {
                console.log('Connexion à la base de données réussie.');
            } else {
                console.error('Échec de la connexion à la base de données.');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la connexion à la base de données:', error);
        });
}

// Appeler la fonction pour vérifier la connexion à la base de données au chargement de la page
document.addEventListener('DOMContentLoaded', verifyDatabaseConnection);

     