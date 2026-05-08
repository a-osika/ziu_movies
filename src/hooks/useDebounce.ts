import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
// Użycie w komponencie:

// const [query, setQuery] = useState('');

// const debouncedQuery = useDebounce(query, 300);

// const { data } = useFetchMovies(page, debouncedQuery);
