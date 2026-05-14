import { useState } from "react";

import { useFetchMovies } from "./hooks/useFetchMovies";
import { useDebounce } from "./hooks/useDebounce";

import { MovieCard } from "./components/MovieCard";
import { MovieModal } from "./components/MovieModal";
import { SkeletonCard } from "./components/SkeletonCard";
import { ErrorBanner } from "./components/ErrorBanner";
import { EmptyState } from "./components/EmptyState";

export default function App() {
  const [page, setPage] = useState(1);

  const [query, setQuery] = useState("");

  const debouncedQuery = useDebounce(query, 300);

  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  const { data, isLoading, isError, error, refetch, isPlaceholderData } =
    useFetchMovies(page, debouncedQuery);

  const movies = data?.results ?? [];
  console.log(data);

  return (
    <main className="container">
      <h1>🎬 Movie Browser</h1>

      <input
        type="text"
        placeholder="Szukaj filmu..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(1);
        }}
      />

      {isLoading && (
        <div className="grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {isError && (
        <ErrorBanner
          message={(error as Error).message}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && movies.length === 0 && <EmptyState />}

      {!isLoading && !isError && movies.length > 0 && (
        <>
          <div className={`grid ${isPlaceholderData ? "loading" : ""}`}>
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelect={setSelectedMovieId}
              />
            ))}
          </div>

          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              ← Poprzednia
            </button>

            <span>Strona {page}</span>

            <button
              disabled={page >= (data?.total_pages ?? 1)}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Następna →
            </button>
          </div>
        </>
      )}

      <MovieModal
        movieId={selectedMovieId}
        onClose={() => setSelectedMovieId(null)}
      />
    </main>
  );
}
