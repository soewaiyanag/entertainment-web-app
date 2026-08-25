import { Show } from "@/types/show.type";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

type TMDbMediaType = "movie" | "tv";

interface TMDbRawItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  adult?: boolean;
  media_type?: "movie" | "tv" | "person";
}

interface TMDbListResponse {
  results: TMDbRawItem[];
}

interface TMDbCastMember {
  name: string;
  character: string;
  profile_path: string | null;
}

interface TMDbDetailRaw extends TMDbRawItem {
  overview?: string;
  tagline?: string;
  genres?: { id: number; name: string }[];
  vote_average?: number;
  runtime?: number; // movies, in minutes
  episode_run_time?: number[]; // tv, in minutes
  number_of_seasons?: number; // tv
  credits?: { cast: TMDbCastMember[] };
}

export interface CastMember {
  name: string;
  character: string;
  profileImage?: string;
}

export interface ShowDetail extends Show {
  overview: string;
  tagline?: string;
  genres: string[];
  voteAverage: number;
  runtimeLabel?: string;
  heroImage?: string;
  cast: CastMember[];
}

async function tmdbFetch<T>(
  path: string,
  params: Record<string, string> = {}
): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`,
      accept: "application/json",
    },
    next: { revalidate: 60 * 60 },
  });

  if (!res.ok) {
    throw new Error(`TMDb request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

function tmdbImage(path: string | null, size: string): string | undefined {
  return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : undefined;
}

function mapToShow(
  item: TMDbRawItem,
  mediaType: TMDbMediaType,
  isTrending = false
): Show | null {
  if (!item.poster_path) return null;

  const dateStr = mediaType === "movie" ? item.release_date : item.first_air_date;

  return {
    slug: `${mediaType}-${item.id}`,
    title: (mediaType === "movie" ? item.title : item.name) ?? "Untitled",
    thumbnail: {
      regular: {
        small: tmdbImage(item.poster_path, "w185")!,
        medium: tmdbImage(item.poster_path, "w342")!,
        large: tmdbImage(item.poster_path, "w500")!,
      },
      trending: item.backdrop_path
        ? {
            small: tmdbImage(item.backdrop_path, "w300")!,
            large: tmdbImage(item.backdrop_path, "w780")!,
          }
        : undefined,
    },
    year: dateStr ? new Date(dateStr).getFullYear() : 0,
    category: mediaType === "movie" ? "Movie" : "TV Series",
    // TMDb list endpoints don't include certification (that's a separate,
    // per-title call) — approximate from the adult flag instead.
    rating: item.adult ? "18+" : "PG",
    isBookmarked: false,
    isTrending,
  };
}

export async function getTrending(): Promise<Show[]> {
  const data = await tmdbFetch<TMDbListResponse>("/trending/all/day");

  return data.results
    .filter((r) => r.media_type === "movie" || r.media_type === "tv")
    .map((r) => mapToShow(r, r.media_type as TMDbMediaType, true))
    .filter((s): s is Show => s !== null && !!s.thumbnail.trending);
}

export async function getPopular(mediaType: TMDbMediaType): Promise<Show[]> {
  const data = await tmdbFetch<TMDbListResponse>(`/${mediaType}/popular`);

  return data.results
    .map((r) => mapToShow(r, mediaType))
    .filter((s): s is Show => s !== null);
}

export async function searchShows(
  query: string,
  mediaType?: TMDbMediaType
): Promise<Show[]> {
  if (!query.trim()) return [];

  if (mediaType) {
    const data = await tmdbFetch<TMDbListResponse>(`/search/${mediaType}`, {
      query,
    });
    return data.results
      .map((r) => mapToShow(r, mediaType))
      .filter((s): s is Show => s !== null);
  }

  const data = await tmdbFetch<TMDbListResponse>("/search/multi", { query });
  return data.results
    .filter((r) => r.media_type === "movie" || r.media_type === "tv")
    .map((r) => mapToShow(r, r.media_type as TMDbMediaType))
    .filter((s): s is Show => s !== null);
}

async function getShowById(
  mediaType: TMDbMediaType,
  id: string
): Promise<Show | null> {
  try {
    const item = await tmdbFetch<TMDbRawItem>(`/${mediaType}/${id}`);
    return mapToShow(item, mediaType);
  } catch {
    return null;
  }
}

export async function getShowDetail(
  compositeSlug: string
): Promise<ShowDetail | null> {
  const [mediaType, id] = compositeSlug.split("-");
  if (mediaType !== "movie" && mediaType !== "tv") return null;

  let raw: TMDbDetailRaw;
  try {
    raw = await tmdbFetch<TMDbDetailRaw>(`/${mediaType}/${id}`, {
      append_to_response: "credits",
    });
  } catch {
    return null;
  }

  const base = mapToShow(raw, mediaType);
  if (!base) return null;

  const runtimeMinutes =
    mediaType === "movie" ? raw.runtime : raw.episode_run_time?.[0];

  const runtimeLabel =
    mediaType === "movie"
      ? runtimeMinutes
        ? `${Math.floor(runtimeMinutes / 60)}h ${runtimeMinutes % 60}m`
        : undefined
      : raw.number_of_seasons
        ? `${raw.number_of_seasons} season${raw.number_of_seasons !== 1 ? "s" : ""}`
        : undefined;

  return {
    ...base,
    overview: raw.overview ?? "",
    tagline: raw.tagline || undefined,
    genres: raw.genres?.map((g) => g.name) ?? [],
    voteAverage: raw.vote_average ?? 0,
    runtimeLabel,
    heroImage: tmdbImage(raw.backdrop_path, "w1280"),
    cast: (raw.credits?.cast ?? []).slice(0, 10).map((c) => ({
      name: c.name,
      character: c.character,
      profileImage: tmdbImage(c.profile_path, "w185"),
    })),
  };
}

export async function getShowsByCompositeIds(
  compositeIds: string[]
): Promise<Show[]> {
  const results = await Promise.all(
    compositeIds.map((composite) => {
      const [mediaType, id] = composite.split("-");
      if (mediaType !== "movie" && mediaType !== "tv") return null;
      return getShowById(mediaType, id);
    })
  );

  return results.filter((s): s is Show => s !== null);
}
