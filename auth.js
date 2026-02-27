/* authentification – CineTech
   ce fichier gère :
   1. l’inscription
   2. la connexion
   3. la session utilisateur
   4. la déconnexion */

/* données utilisateurs Stockées en localStorage(simulation backend) */
let users = JSON.parse(localStorage.getItem("users")) || [];

/* references DOM */
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

/* popup utilitaire de confirmation et d'erreur */
function showPopup(message, confirm = false, callback = null) {
  const popup = document.getElementById("popup");
  const msg = document.getElementById("popupMessage");
  const btnConfirm = document.getElementById("popupConfirm");
  const btnCancel = document.getElementById("popupCancel");

  // texte du message
  msg.textContent = message;
  popup.classList.remove("hidden");
  btnCancel.style.display = confirm ? "inline-block" : "none";

  /* gestion des boutons */
  btnConfirm.onclick = () => {
    popup.classList.add("hidden");
    if (callback) callback(true);
  };

  btnCancel.onclick = () => {
    popup.classList.add("hidden");
    if (callback) callback(false);
  };
}

/* connexion */
loginForm.addEventListener("submit", e => {
  e.preventDefault();

  const username = document.getElementById("loginUser").value.trim();
  const password = document.getElementById("loginPass").value.trim();

  // recherche de l’utilisateur
  const user = users.find(u => u.username === username);

  // utilisateur existant
  if (!user) {
    showPopup("Compte inexistant. Veuillez vous inscrire d'abord.");
    return;
  }

  // vérification du mot de passe
  if (user.password !== password) {
    showPopup("Mot de passe incorrect.");
    return;
  }

  // Connexion réussie
  showPopup(`Connexion réussie ✔ Bienvenue, ${username} !`);
  loginForm.reset();
});

/* inscription */
registerForm.addEventListener("submit", e => {
  e.preventDefault();

  const username = document.getElementById("registerUser").value.trim();
  const password = document.getElementById("registerPass").value.trim();

  // validation des champs obligatoires(sécurité minimale)
  if (!username || !password) {
    showPopup("Veuillez remplir tous les champs.");
    return;
  }

  // vérifier si le compte existe déjà
  if (users.find(u => u.username === username)) {
    showPopup("Ce compte déjà existant.");
    return;
  }

  // création du compte
  users.push({ username, password });
  // sauvegarde dans le localStorage
  localStorage.setItem("users", JSON.stringify(users));

  showPopup(`Inscription réussie ✔ Bienvenue, ${username} !`);
  // remise à zero du formulaire
  registerForm.reset();
});