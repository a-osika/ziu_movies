import { useMovieDetails } from "../hooks/useMovieDetails";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  movieId: number | null;
  onClose: () => void;
}

const IMG_BASE = "https://image.tmdb.org/t/p/w500";

export function MovieModal({ movieId, onClose }: Props) {
  const { data, isLoading, isError } = useMovieDetails(movieId);

  if (movieId === null) return null;

  return (
    <AnimatePresence>
      {movieId !== null && (
        <div className="modal-backdrop" onClick={onClose}>
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
          >
            <button onClick={onClose}>✖</button>

            {isLoading && <p>Ładowanie...</p>}

            {isError && <p>Błąd pobierania szczegółów.</p>}

            {data && (
              <>
                <img
                  src={
                    data.poster_path
                      ? `${IMG_BASE}${data.poster_path}`
                      : "/no-poster.png"
                  }
                  alt={data.title}
                />

                <h2>{data.title}</h2>

                <p>{data.overview}</p>

                <p>⭐ {data.vote_average}</p>

                <p>📅 {data.release_date}</p>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
