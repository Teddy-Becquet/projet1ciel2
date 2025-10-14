//si le mots de âsse et le nom d'utilisateur sont correct alors rediriger vers  page.html sinon afficher un message d'erreur
// verifier.js --- front-end vérification mot de passe et nom d'utilisateur
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

    //vérifier le mot de passe et le nom d'utilisateur en bdd
    document.addEventListener('submit', (e) => {
        if (e.target && e.target.id === 'login-form') { 
            e.preventDefault();
            showError('');

            const username = document.getElementById('username').value.trim();// recupere la valeur du champ username
            const password = document.getElementById('password').value;// recupere la valeur du champ password

            if (!username || !password) {
                showError('Veuillez remplir tous les champs.');
                return;
            }

            //si le mot de passe et le nom d'utilisateur sont correct alors rediriger vers  page.html sinon afficher un message d'erreur
            if (username === DEMO_USER.username && password === DEMO_USER.password) {
                setSession(username);
                window.location.href = "http://172.29.18.254/projet1ciel2/front/html/index.html"; // redirection vers la page de connection
                return;
            } else {
                showError('Identifiant ou mot de passe invalide.');// message d'erreur si le mot de passe ou le nom d'utilisateur est incorrect
            }
        }
    });
})();