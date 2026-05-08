import { useState } from "react";
import { useCharacters } from "../hooks/useCharacters";
import { useDebounce } from "../hooks/useDebounce";

export function CharactersList() {
  const [page, setPage] = useState(1);
  const [name, setName] = useState("");
  const debouncedQuery = useDebounce(name, 300);
  const { data, isLoading, error } = useCharacters(page, debouncedQuery);

  if (isLoading) return <p>Loading characters...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <ul>
        {data?.results.map((char) => (
          <li key={char.id}>
            <img src={char.image} alt={char.name} width="50" />
            {char.name} - {char.status} ({char.species})
          </li>
        ))}
      </ul>
      <button className="counter" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
        Previous
      </button>
      <button className="counter" onClick={() => setPage((p) => p + 1)} disabled={!data?.info.next}>
        Next
      </button>
    </div>
  );
}