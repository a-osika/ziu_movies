import { useState, useCallback } from "react";
import { useFavorites } from "../hooks/useFavorites";
import type { Movie } from "../hooks/useFetchMovies";

const IMG_BASE = "https://image.tmdb.org/t/p/w500";

interface Props {
  movie: Movie;
  onSelect: (id: number) => void;
}

export function MovieCard({ movie, onSelect }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();

  const [optimisticFav, setOptimisticFav] = useState<boolean | null>(null);

  // Stan wyświetlany = optimistic (jeśli ustawiony) ?? rzeczywisty

  const displayedFav = optimisticFav ?? isFavorite(movie.id);

  const handleToggle = useCallback(async () => {
    // 1. Natychmiast zaktualizuj UI (optimistic)

    setOptimisticFav(!displayedFav);

    try {
      // 2. Wykonaj faktyczną operację

      await toggleFavorite(movie);

      // 3. Wyczyść stan optimistic — rzeczywisty stan zsynchronizowany

      setOptimisticFav(null);
    } catch {
      // 4. Rollback przy błędzie

      setOptimisticFav(null);
    }
  }, [displayedFav, toggleFavorite, movie]);

  return (
    <div className="movie-card" onClick={() => onSelect(movie.id)}>
      <img
        src={
          movie.poster_path
            ? `${IMG_BASE}${movie.poster_path}`
            : "/no-poster.png"
        }
        alt={movie.title}
      />

      <h3>{movie.title}</h3>

      <p>
        {movie.release_date?.slice(0, 4)} • ⭐ {movie.vote_average.toFixed(1)}
      </p>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleToggle();
        }}
        aria-label={displayedFav ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
        className={`fav-btn ${displayedFav ? "active" : ""}`}
      >
        {displayedFav ? "❤️" : "🤍"}
      </button>
    </div>
  );
}
