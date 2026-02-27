/* API OMDB - cinetech
   role :
   1. Récupere automatiquement l’affiche d’un film
   2. Récupere le rating IMDb d’un film
   3. Évite les appels inutiles(en cas de données déjà présentes)
   4. Sauvegarde immédiatement les données en localStorage */

/*petite explication:
  cette fonction est volontairement simple et sécurisée.
  elle est appelée depuis Films.js uniquement quand :
  - l’utilisateur n’a pas fourni d’affiche
  - ou en cas quand le rating est manquant
*/

function fetchPoster(title, index) {
  // sécurité en cas si le titre ou le film n’existe plus, on stoppe
  if (!title || !films[index]) return;

   // appel API OMDB avec le titre du film
  fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=564727fa`)
    .then(res => res.json())
    .then(data => {
      // si le film a été supprimé entre temps
      if (!films[index]) return;

      let updated = false;

      /* poster */
      // si OMDB fournit une affiche valide
      if (data?.Poster && data.Poster !== "N/A") {
        films[index].poster = data.Poster;
        updated = true;
      } 
      // sinon, si aucune affiche n’existe déjà
      else if (!films[index].poster) {
        // image de remplacement permanente si OMDB indisponible
        films[index].poster =
          "https://via.placeholder.com/80x120?text=No+Image";
        updated = true;
      }

      /* rating */
      // on récupere le rating uniquement s’il n’existe pas encore
      if (
        data?.imdbRating &&
        data.imdbRating !== "N/A" &&
        !films[index].rating
      ) {
        films[index].rating = Number(data.imdbRating);
        updated = true;
      }

      /* le sauvegarde immédiatement */
      // on sauvegarde uniquement s’il y a eu une modification
      if (updated) {
        localStorage.setItem("films", JSON.stringify(films));
        // mise à jour de l’interface immédiate
        displayFilms();
        updateDashboard();
      }
    })
    .catch(() => {
      /* fallback */
      // OMDB indisponible s'affiche par défaut en cas d’erreur réseau ou API indisponible ou clé invalide
      if (films[index] && !films[index].poster) {
        films[index].poster =
          "https://via.placeholder.com/80x120?text=No+Image";
        localStorage.setItem("films", JSON.stringify(films));
        displayFilms();
      }
    });
}
