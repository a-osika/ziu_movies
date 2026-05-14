import { http, HttpResponse, delay } from "msw";

const TMDB_BASE = "https://api.themoviedb.org/3";

export const handlers = [
  http.get(`${TMDB_BASE}/movie/popular`, async ({ request }) => {
    await delay(800);

    const url = new URL(request.url);

    const page = Number(url.searchParams.get("page") ?? 1);

    return HttpResponse.json({
      page,
      total_pages: 10,

      results: Array.from({ length: 20 }, (_, i) => ({
        id: page * 100 + i,
        title: `Film ${page}-${i + 1}`,
        overview: "Opis filmu",
        poster_path: null,
        release_date: "2024-01-01",
        vote_average: 7.5,
        genre_ids: [28],
      })),
    });
  }),

  http.get(`${TMDB_BASE}/movie/:id`, async ({ params }) => {
    await delay(500);

    return HttpResponse.json({
      id: params.id,
      title: `Film ${params.id}`,
      overview: "Szczegóły filmu",
      poster_path: null,
      release_date: "2024-01-01",
      vote_average: 8.2,
    });
  }),

  http.get(`${TMDB_BASE}/search/movie`, async ({ request }) => {
    await delay(500);

    const url = new URL(request.url);

    const query = url.searchParams.get("query") ?? "";

    return HttpResponse.json({
      page: 1,

      total_pages: 1,

      results: query
        ? [
            {
              id: 999,
              title: `Wynik dla "${query}"`,
              overview: "Mock search result",
              poster_path: null,
              release_date: "2024-01-01",
              vote_average: 9.1,
              genre_ids: [12],
            },
          ]
        : [],
    });
  }),
];
