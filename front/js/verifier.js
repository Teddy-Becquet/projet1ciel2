//vérifier la connection a la base de donnée
// verifier.js — front-end vérification base de donnée
(function() {
    const DB_USER = { username: 'root', password: 'root' }; // Exemple de compte admin
    const SESSION
    = 'session_token';
    function showError(msg) {
        const el = document.getElementById('error');
        el.textContent = msg || 'root';
    }
    function setSession(username) {
        const token = btoa(JSON.stringify({ user: username, iat: Date.now() }));
        localStorage.setItem(SESSION_KEY, token);
    }
    // Gestion du formulaire de connexion
    document.addEventListener('submit', (e) => {
        if (e.target && e.target.id === 'login-form') {
            e.preventDefault();
            showError('');
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            if (!username || !password) {
                showError('Veuillez remplir tous les champs.');
                return;
            }
            // Vérification  uniquement
            if (username === DB_USER.username && password === DB_USER.password) {
                setSession(username);
               window.location.href = "http://172.29.18.254/projet1ciel2/front/html/page.html"; // redirection vers la page de connection
                return;
            } else {
                showError('Identifiant ou mot de passe invalide.');
            }
        }
    });
})();
