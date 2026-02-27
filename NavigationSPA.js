/* navigation SPA – CineTech
   role:
   - gére la navigation sans recharger la page
   - affiche et cache les sections
   - gére la sidebar
   - gére le thème clair et sombre
   - gére la recherche globale */

/* afficher une section (SPA)
   cette fonction est appelée depuis :
   - les boutons de la sidebar
   - le dashboard
   - la recherche globale */
function showSection(id) {
  // on cache toutes les sections actuelles
  document.querySelectorAll(".section").forEach(section => {
    section.classList.remove("active");
  });

  // on affiche uniquement la section demandée
  const target = document.getElementById(id);
  if (target) target.classList.add("active");

  // mise à jour spécifique selon la section affichée 
  if (id === "dashboard") updateDashboard();
  if (id === "films") displayFilms();
  if (id === "directors") displayDirectors();
}

/* gestion du theme soit clair ou sombre(le thème est appliqué sur le body) */
function toggleTheme() {
  document.body.classList.toggle("light");
}

/* gestion du sidebar(ouverture ou fermeture avec animation) */
// bouton toogle
const toggleSidebarBtn = document.getElementById("toggleSidebar");
// sidebar 
const sidebar = document.querySelector(".sidebar");

// événement au clic sur le bouton toggle 
toggleSidebarBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

/* recherche globale(se recherche simultanément les films et les réalisateurs) */
const globalSearch = document.getElementById("globalSearch");

globalSearch.addEventListener("input", e => {
  // il recupere la valeur saisie par l’utilisateur
  const value = e.target.value.toLowerCase().trim();

  // si la valeur est vide, on affiche touts les films et réalisateurs
  if (value === "") {
    displayFilms();
    displayDirectors();
    return;
  }

  // recherche films
  const filmResults = films.filter(f =>
    f.title.toLowerCase().includes(value)
  );

  // recherche realisateurs
  const directorResults = directors.filter(d =>
    d.toLowerCase().includes(value)
  );

  /* ================= LOGIQUE D’AFFICHAGE ================= */
  // priorité aux films
  if (filmResults.length > 0) {
    showSection("films");
    displayFilms(filmResults);
    // Sinon, afficher les realisateurs
  } else if (directorResults.length > 0) {
    showSection("directors");
    displayDirectors(directorResults);
  } else {
    // si aucun resultat, afficher aucun résultat trouvé
    showSection("films");
    displayFilms([]);
  }
});