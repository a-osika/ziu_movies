import { useMovieDetails } from "../hooks/useMovieDetails";

interface Props {
  movieId: number | null;
  onClose: () => void;
}

const IMG_BASE = "https://image.tmdb.org/t/p/w500";

export function MovieModal({ movieId, onClose }: Props) {
  const { data, isLoading, isError } = useMovieDetails(movieId);

  if (movieId === null) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
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
      </div>
    </div>
  );
}
