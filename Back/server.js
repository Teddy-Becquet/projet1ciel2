// login.js — front-end avec compte root
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

    // Form submission
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
            if (username === DEMO_USER.username && password === DEMO_USER.password) {
                setSession(username);
                window.location.href = ''; // redirection vers la page de connection 
                return;
            } else {
                showError('Identifiant ou mot de passe invalide.');
            }
        }
    });
})();