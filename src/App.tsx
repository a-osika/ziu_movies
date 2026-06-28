import { useState, useEffect } from "react";

import { useFetchMovies } from "./hooks/useFetchMovies";
import { useDebounce } from "./hooks/useDebounce";

import { MovieCard } from "./components/MovieCard";
import { MovieModal } from "./components/MovieModal";
import { SkeletonCard } from "./components/SkeletonCard";
import { ErrorBanner } from "./components/ErrorBanner";
import { EmptyState } from "./components/EmptyState";

import { motion } from "framer-motion";
import { useFavorites } from "./hooks/useFavorites";

import { FavoritesList } from "./components/FavoritesList";

import { ToastContainer } from "./components/ToastContainer";

import { plausible } from "./analytics.ts";

export default function App() {
  const [page, setPage] = useState(1);

  const [query, setQuery] = useState("");

  const debouncedQuery = useDebounce(query, 300);

  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  const { data, isLoading, isError, error, refetch, isPlaceholderData } =
    useFetchMovies(page, debouncedQuery);

  const movies = data?.results ?? [];

  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);

  const addToast = (message: string) => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  useEffect(() => {
    if (debouncedQuery.trim() === "") return;

    plausible.trackEvent("Search Movie", {
      props: {
        search: debouncedQuery,
      },
    });
    // Zbieramy informację o wyszukiwanych tytulach
    // Dane są potrzebne do analizy popularnosci wyszukan
    // Nie zapisujemy danych osobowych.
  }, [debouncedQuery]);

  const { favorites, setFavorites } = useFavorites();

  const containerVariants = {
    hidden: { opacity: 0 },

    visible: {
      opacity: 1,

      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 16,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.25,
      },
    },
  };

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

      {favorites.length > 0 && (
        <>
          <h2>⭐ Ulubione</h2>

          <FavoritesList favorites={favorites} setFavorites={setFavorites} />
        </>
      )}

      {isLoading && (
        <motion.div
          className="grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </motion.div>
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
          <motion.div
            className={`grid ${isPlaceholderData ? "loading" : ""}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {movies.map((movie) => (
              <motion.div key={movie.id} variants={itemVariants}>
                <MovieCard
                  movie={movie}
                  onSelect={setSelectedMovieId}
                  onToast={addToast}
                />
              </motion.div>
            ))}
          </motion.div>

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

      <ToastContainer toasts={toasts} />
    </main>
  );
}
