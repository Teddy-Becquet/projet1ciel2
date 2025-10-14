//vérifier le mots de passe soit le meme dans les deux champs de la page de creation de compte
// mdp.js — front-end vérification mot de passe
(function() {
    const passwordInput = document.getElementById('password');// recupere la valeur du champ password
    const confirmPasswordInput = document.getElementById('confirm-password');// recupere la valeur du champ confirm-password
    const errorDiv = document.getElementById('error');// recupere la valeur du champ error

    function validatePasswords() {
        if (passwordInput.value !== confirmPasswordInput.value) {// compare les deux champs
            errorDiv.textContent = 'Les mots de passe ne correspondent pas.';// message d'erreur si les deux champs sont different
            return false;// retourne false si les deux champs sont different
        }
        errorDiv.textContent = '';// vide le message d'erreur si les deux champs sont identiques
        return true;// retourne true si les deux champs sont identiques
    }

    passwordInput.addEventListener('input', validatePasswords);// ecoute les changements dans le champ password
    confirmPasswordInput.addEventListener('input', validatePasswords);// ecoute les changements dans le champ confirm-password

    // Validation finale lors de la soumission du formulaire

    document.getElementById('creation-form').addEventListener('submit', function(e) {// ecoute la soumission du formulaire
        if (!validatePasswords()) {// si les deux champs sont different
            e.preventDefault();// empêche la soumission du formulaire si les deux champs sont different
        }
    });
})();