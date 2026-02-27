/* dashboard dynamique – cinetech
   role principal :
   1. affiche les statistiques globales
   2. mise à jour les compteurs
   3. génére le graphique Chart.js */
/*
  On garde une référence du graphique
  pour pouvoir le détruire avant chaque mise à jour
  (en raison d'éviter les bugs et les doublons)
*/

let chartInstance = null;

/* mise à jour du dashboard */
function updateDashboard() {
  // récupération des éléments HTML
  const totalFilmsEl = document.getElementById("totalFilms");
  const totalDirectorsEl = document.getElementById("totalDirectors");
  const canvas = document.getElementById("filmsChart");

  // sécurité en cas si on n’est pas sur la page dashboard
  if (!totalFilmsEl || !totalDirectorsEl || !canvas) return;

  /* compteurs(calcul des films et des réalisateurs uniques) */
  // nombre total des films
  totalFilmsEl.textContent = films.length;
  // nombre total de réalisateurs
  totalDirectorsEl.textContent = directors.length;

  /* graphique Chart.js */
  // destruction de l’ancienne instance avant d’en créer une nouvelle
  if (chartInstance) chartInstance.destroy();

  // si aucun film, on ne crée pas le graphique
  if (films.length === 0) return;

  // préparation des données utilisées par le graphique
  const labels = films.map(f => f.title);
  const years = films.map(f => f.year);
  const ratings = films.map(f => f.rating || 0);

  // création du graphique à barres
  chartInstance = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Année de sortie",
          data: years,
          backgroundColor: "#4f8cff"
        },
        {
          label: "Rating IMDb",
          data: ratings,
          backgroundColor: "#9b6bff"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: "#999" }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: "#999" }
        },
        x: {
          ticks: { color: "#999" }
        }
      }
    }
  });
}

/* inițialisation du dashboard(Le dashboard se met à jour au chargement de la page) */
updateDashboard();