// login.js — front-end avec compte root
(function() {
// Compte de démonstration
    const DEMO_USER = { username: 'root', password: 'root' };
    const SESSION_KEY = 'session_token';
    const root = 'root';

    // Afficher les messages d'erreur
    function showError(msg) {
        const el = document.getElementById('error');
        el.textContent = msg || 'root';
    }

    // Remplir automatiquement les champs avec le compte 
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'fill-root') {
            document.getElementById('').value = root;// remplit le champ username avec 
            document.getElementById('').value = root;// remplit le champ password avec 
        }
    });

    // Gestion du formulaire de connexion
    document.addEventListener('submit', (e) => {
        if (e.target && e.target.id === 'login-form') { // si le formulaire soumis est celui de connexion
            e.preventDefault();
            showError('');

            const username = document.getElementById('username').value.trim();// recupere la valeur du champ username
            const password = document.getElementById('password').value;// recupere la valeur du champ password

            if (!username || !password) {
                showError('Veuillez remplir tous les champs.');// message d'erreur si les champs sont vides
                return;
            }

            // Vérification  du mot de passe et du nom d'utilisateur en bdd
            if (username === DEMO_USER.username && password === DEMO_USER.password) {// si le mot de passe et le nom d'utilisateur sont corrects
                // Simuler la création d'une session
                function setSession(username) {
                    const token = btoa(`${username}:${new Date().getTime()}`); // simple token encodé en base64
                    localStorage.setItem(SESSION_KEY, token);
                }
                setSession(username);
                window.location.href = "http://172.29.18.254/phpmyadmin/"; // redirection vers la bdd pour vérifier le mot de passe et le nom d'utilisateur
                return;
            } else {
                showError('Identifiant ou mot de passe invalide.');// message d'erreur si le mot de passe ou le nom d'utilisateur est incorrect
            }
        }
    });
})();
// Pour tester la connection a la bdd : http://172.29.18.254/phpmyadmin/
fetch('http://172.29.18.254/phpmyadmin/')
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Erreur:', error));
//tester que le serveur fonctionne
fetch('http://172.29.18.254/Pojet1ciel2/back/server.js')
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Erreur:', error));

//tester la route de la page de connection
fetch('http://172.29.18.254/Pojet1ciel2/front/html/index.html')
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Erreur:', error));

//tester la route de la page de creation de compte
fetch('http://172.29.18.254/Pojet1ciel2/front/html/creation.html')
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Erreur:', error));

//tester node server.js
fetch('http://172.29.18.254/Pojet1ciel2/back/server.js')
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Erreur:', error));