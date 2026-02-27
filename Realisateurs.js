/* gestion des realisateurs – CineTech
   ce code js gère :
   1. l’ajout de réalisateurs
   2. la suppression
   3. l’affichage
   4. la recherche
   5. la synchronisation avec les films */

/* les données des realisateurs sont récupérées depuis le localStorage */
let directors = JSON.parse(localStorage.getItem("directors")) || [];

/* references DOM */
const directorForm = document.getElementById("directorForm");
const directorList = document.getElementById("directorList");
const directorSearch = document.getElementById("directorSearch");
const directorNotFound = document.getElementById("directorNotFound");

const directorEditIndex = document.getElementById("directorEditIndex");

/* popup utilitaire de confirmation et d'erreur */
function showPopup(message, confirm = false, callback = null) {
  /* references DOM */
  const popup = document.getElementById("popup");
  const msg = document.getElementById("popupMessage");
  const btnConfirm = document.getElementById("popupConfirm");
  const btnCancel = document.getElementById("popupCancel");
  /* texte du message */
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

/* affichage des realisateurs */
function displayDirectors(list = directors) {
  directorList.innerHTML = "";

  // si aucun résultat existe
  if (!list || list.length === 0) {
    directorNotFound.classList.remove("hidden");
    return;
  }

  directorNotFound.classList.add("hidden");

  // génération dynamique des cartes realisateurs
  list.forEach((director, index) => {
    directorList.innerHTML += `
      <li>
        <span onclick="showFilmsByDirector('${director}')">${director}</span>
        <div>
          <button onclick="editDirector(${index})">✏️</button>
          <button onclick="confirmDeleteDirector(${index})">❌</button>
        </div>
      </li>
    `;
  });

  updateDirectorSelect(); // synchroniser avec Films.js
  updateDashboard();
}

/* l'ajout et la modification du realisateur */
directorForm.addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("directorName").value.trim();
  const index = directorEditIndex.value;

  // sécurité(validation minimale des champs obligatoires)
  if (!name) return;

  if (index === "") {
    // empecher les doublons
    if (directors.includes(name)) {
      showPopup("Ce réalisateur existe déjà.");
      return;
    }
    directors.push(name);
  } else {
    const oldName = directors[index];
    directors[index] = name;

    // Mettre à jour les films liés
    films.forEach(f => {
      if (f.director === oldName) f.director = name;
    });

    directorEditIndex.value = "";
  }

  /* sauvegarde dans le localStorage */
  localStorage.setItem("directors", JSON.stringify(directors));
  localStorage.setItem("films", JSON.stringify(films));

  /* remise à zero du formulaire */
  directorForm.reset();
  displayDirectors();
});

/* edition d’un realisateur */
function editDirector(index) {
  document.getElementById("directorName").value = directors[index];
  directorEditIndex.value = index;
  showSection("directors");
}

/* suppression d’un realisateur(avec confirmation) */
function confirmDeleteDirector(index) {
  showPopup("Supprimer ce réalisateur ?", true, confirmed => {
    if (confirmed) {
      const name = directors[index];

      // Supprimer lien dans films si realisateur supprimé
      films.forEach(f => {
        if (f.director === name) f.director = "";
      });

      /* suppression du realisateur */
      directors.splice(index, 1);
      // Sauvegarde globale
      localStorage.setItem("directors", JSON.stringify(directors));
      localStorage.setItem("films", JSON.stringify(films));

      /* remise à zero du formulaire */
      displayDirectors();
      displayFilms();
    }
  });
}

/* recherche des realisateurs */
directorSearch.addEventListener("input", () => {
  const value = directorSearch.value.toLowerCase().trim();
  const filtered = directors.filter(d =>
    d.toLowerCase().includes(value)
  );
  displayDirectors(filtered);
});

/* affichage des films d’un realisateur */
function showFilmsByDirector(name) {
  const related = films.filter(f => f.director === name);
  showSection("films");
  displayFilms(related);
}

/* initialisation */
displayDirectors();