import { Reorder } from "framer-motion";

import type { Movie } from "../hooks/useFetchMovies";

interface Props {
  favorites: Movie[];
  setFavorites: (movies: Movie[]) => void;
}

export function FavoritesList({ favorites, setFavorites }: Props) {
  return (
    <Reorder.Group axis="y" values={favorites} onReorder={setFavorites}>
      {favorites.map((movie) => (
        <Reorder.Item key={movie.id} value={movie}>
          <div className="movie-card">{movie.title}</div>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}
