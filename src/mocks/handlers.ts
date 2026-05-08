import { http, HttpResponse, delay } from "msw";

const TMDB_BASE = "https://api.themoviedb.org/3";

export const handlers = [
  // Mock listy popularnych filmów

  http.get(`${TMDB_BASE}/movie/popular`, async ({ request }) => {
    await delay(800); // symuluj opóźnienie sieci

    const url = new URL(request.url);

    const page = Number(url.searchParams.get("page") ?? 1);

    return HttpResponse.json({
      page,

      total_pages: 10,

      results: Array.from({ length: 20 }, (_, i) => ({
        id: page * 100 + i,
        title: `Film testowy ${page}-${i + 1}`,
        overview: "Opis testowego filmu.",
        poster_path: null,
        release_date: "2024-01-01",
        vote_average: 7.5,
        genre_ids: [28, 12],
      })),
    });
  }),

  // Mock błędu autoryzacji — do testowania ErrorBanner

  http.get(`${TMDB_BASE}/movie/popular`, () => {
    return HttpResponse.json(
      { status_message: "Invalid API key." },

      { status: 401 },
    );
  }),

  // Rick & Morty — mock dla testów jednostkowych

  http.get("https://rickandmortyapi.com/api/character", () => {
    return HttpResponse.json({
      info: { count: 2, pages: 1, next: null },

      results: [
        {
          id: 1,
          name: "Rick Sanchez",
          status: "Alive",
          species: "Human",
          image: "",
        },

        {
          id: 2,
          name: "Morty Smith",
          status: "Alive",
          species: "Human",
          image: "",
        },
      ],
    });
  }),
];
