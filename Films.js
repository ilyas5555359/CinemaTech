/* gestion des films – CineTech
   ce code js gère:
   1. l’ajout de films
   2. la modification
   3. la suppression
   4. l’affichage
   5. la recherche et le tri
   6. la liaison avec l’API OMDB */

/* les données du films sont récupérées depuis le localStorage */

let films = JSON.parse(localStorage.getItem("films")) || [];

/* references DOM */
const filmForm = document.getElementById("filmForm");
const filmList = document.getElementById("filmList");
const filmSearch = document.getElementById("filmSearch");
const filmSort = document.getElementById("filmSort");
const filmNotFound = document.getElementById("filmNotFound");

const directorSelect = document.getElementById("filmDirector");

/* synchronisation des realisateurs uniques(met à jour la liste déroulante) */
function updateDirectorSelect() {
  directorSelect.innerHTML = `<option value="">Réalisateur</option>`;
  directors.forEach(d => {
    directorSelect.innerHTML += `<option value="${d}">${d}</option>`;
  });
}

/* popup utilitaire de confirmation et d'erreur
   utilisé pour:
   - les confirmations
   - les messages informatifs */
function showPopup(message, confirm = false, callback = null) {
  const popup = document.getElementById("popup");
  const msg = document.getElementById("popupMessage");
  const btnConfirm = document.getElementById("popupConfirm");
  const btnCancel = document.getElementById("popupCancel");

  // texte du message
  msg.textContent = message;
  // affichage du popup
  popup.classList.remove("hidden");
  // bouton annuler visible uniquement en mode confirmation
  btnCancel.style.display = confirm ? "inline-block" : "none";

  // bouton ok(Confirmation)
  btnConfirm.onclick = () => {
    popup.classList.add("hidden");
    if (callback) callback(true);
  };

  // bouton Annuler
  btnCancel.onclick = () => {
    popup.classList.add("hidden");
    if (callback) callback(false);
  };
}

/* affichage des films */
function displayFilms(list = films) {
  // nettoyage de la liste
  filmList.innerHTML = "";

  // en cas aucun résultat
  if (!list || list.length === 0) {
    filmNotFound.classList.remove("hidden");
    return;
  }

  filmNotFound.classList.add("hidden");

  // génération dynamique des cartes films
  list.forEach((film, index) => {
    filmList.innerHTML += `
      <div class="film-card">
        <img src="${film.poster || 'https://via.placeholder.com/80x120?text=No+Image'}" alt="${film.title}">
        <div>
          <h3>${film.title}</h3>
          <p>🎬 ${film.genre || "—"} | ${film.year}</p>
          <p>🎥 Réalisateur : ${film.director || "—"}</p>
          <p>⭐ Rating : ${film.rating ?? "—"}</p>
          <div class="actions">
            <button onclick="editFilm(${index})">✏️</button>
            <button onclick="confirmDeleteFilm(${index})">❌</button>
          </div>
        </div>
      </div>
    `;
  });

  // une mise à jour du dashboard
  updateDashboard();
}

/* ajout et modification du film */
filmForm.addEventListener("submit", e => {
  e.preventDefault();

  // un index utilisé uniquement en mode édition
  const index = document.getElementById("editIndex").value;
  // récupération des valeurs des champs 
  const title = document.getElementById("title").value.trim();
  const year = document.getElementById("year").value;
  const genre = document.getElementById("genre").value.trim();
  const director = directorSelect.value;
  const rating = document.getElementById("rating").value;
  const poster = document.getElementById("poster").value.trim();

  // sécurité(validation minimale des champs obligatoires)
  if (!title || !year) return;

  const filmData = { title, year, genre, director, rating, poster };

  /* l'ajout */
  if (index === "") {
    films.push(filmData);
    // en cas si aucune affiche inseré par l’utilisateur, appel API OMDB
    const newIndex = films.length - 1;

    if (!poster) fetchPoster(title, newIndex);
  } 
  /* la modification */
  else {
    films[index] = filmData;
    if (!poster) fetchPoster(title, index);
  }

  /* sauvegarde dans le localStorage */
  localStorage.setItem("films", JSON.stringify(films));
  // reset formulaire
  filmForm.reset();
  document.getElementById("editIndex").value = "";

  displayFilms();
});

/* édition d’un film(affiche le formulaire) */
function editFilm(index) {
  const film = films[index];

  document.getElementById("editIndex").value = index;
  document.getElementById("title").value = film.title;
  document.getElementById("year").value = film.year;
  document.getElementById("genre").value = film.genre;
  directorSelect.value = film.director || "";
  document.getElementById("rating").value = film.rating || "";
  document.getElementById("poster").value = film.poster || "";

  showSection("films");
}

/* suppression d’un film(avec confirmation) */
function confirmDeleteFilm(index) {
  showPopup("Supprimer ce film ?", true, confirmed => {
    if (confirmed) {
      films.splice(index, 1);
      localStorage.setItem("films", JSON.stringify(films));
      displayFilms();
    }
  });
}

/* recherche des films */
filmSearch.addEventListener("input", () => {
  const value = filmSearch.value.toLowerCase().trim();
  const filtered = films.filter(f =>
    f.title.toLowerCase().includes(value)
  );
  displayFilms(filtered);
});

/* tri des films */
filmSort.addEventListener("change", () => {
  let sorted = [...films];

  switch (filmSort.value) {
    case "az": sorted.sort((a, b) => a.title.localeCompare(b.title)); break;
    case "za": sorted.sort((a, b) => b.title.localeCompare(a.title)); break;
    case "year": sorted.sort((a, b) => b.year - a.year); break;
    case "rating": sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
  }

  displayFilms(sorted);
});

/* initialisation au niveau de chargement */
updateDirectorSelect();
displayFilms();