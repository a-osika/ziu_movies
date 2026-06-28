import { useState, useCallback } from "react";
import type { Movie } from "./useFetchMovies";
import { plausible } from "../analytics.ts";

const STORAGE_KEY = "movie-browser-favorites";

function loadFavorites(): Movie[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Movie[]>(loadFavorites);

  const toggleFavorite = useCallback(
    async (movie: Movie) => {
      const isAlreadyFavorite = favorites.some((m) => m.id === movie.id);
      const actionType = isAlreadyFavorite ? "remove" : "add";

      plausible.trackEvent("Toggle Favorite", {
        props: {
          button: "favorite",
          movie: movie.title,
          id: movie.id,
          action: actionType,
        },
      });
      // Zbieramy informację o kliknięciu CTA.
      // Dane są potrzebne do analizy skuteczności przycisku.
      // Nie zapisujemy danych osobowych.
      setFavorites((prev) => {
        const next = prev.some((m) => m.id === movie.id)
          ? prev.filter((m) => m.id !== movie.id)
          : [...prev, movie];

        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

        return next;
      });
    },
    [favorites],
  );

  const isFavorite = useCallback(
    (id: number) => favorites.some((m) => m.id === id),

    [favorites],
  );

  return {
    favorites,
    setFavorites,
    toggleFavorite,
    isFavorite,
  };
}
