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

// Bookmarks encode their TMDb id as "movie-<id>"/"tv-<id>" (see mapToShow
// below) so lookups stay unambiguous across TMDb's separate movie/TV id
// spaces. This is the one place that decodes it back.
function parseCompositeSlug(
  slug: string
): { mediaType: TMDbMediaType; id: string } | null {
  const [mediaType, id] = slug.split("-");
  if (mediaType !== "movie" && mediaType !== "tv") return null;
  return { mediaType, id };
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

// Maps a page of raw TMDb results to Shows, dropping any that mapToShow
// rejects (e.g. no poster). `getMediaType` lets callers pass either a fixed
// type (a single-media-type endpoint) or a per-item lookup (mixed endpoints
// like trending/search-multi, which tag each result with its own type).
function toShows(
  items: TMDbRawItem[],
  getMediaType: (item: TMDbRawItem) => TMDbMediaType,
  isTrending = false
): Show[] {
  return items
    .map((r) => mapToShow(r, getMediaType(r), isTrending))
    .filter((s): s is Show => s !== null);
}

function isMovieOrTV(item: TMDbRawItem): boolean {
  return item.media_type === "movie" || item.media_type === "tv";
}

export async function getTrending(): Promise<Show[]> {
  const data = await tmdbFetch<TMDbListResponse>("/trending/all/day");
  const items = data.results.filter(isMovieOrTV);

  return toShows(items, (r) => r.media_type as TMDbMediaType, true).filter(
    (s) => !!s.thumbnail.trending
  );
}

export async function getPopular(mediaType: TMDbMediaType): Promise<Show[]> {
  const data = await tmdbFetch<TMDbListResponse>(`/${mediaType}/popular`);
  return toShows(data.results, () => mediaType);
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
    return toShows(data.results, () => mediaType);
  }

  const data = await tmdbFetch<TMDbListResponse>("/search/multi", { query });
  const items = data.results.filter(isMovieOrTV);
  return toShows(items, (r) => r.media_type as TMDbMediaType);
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

// Movies show a duration ("2h 14m"); TV shows show a season count instead,
// since TMDb doesn't give a single meaningful runtime for a whole series.
function formatRuntimeLabel(
  mediaType: TMDbMediaType,
  runtimeMinutes: number | undefined,
  numberOfSeasons: number | undefined
): string | undefined {
  if (mediaType === "movie") {
    if (!runtimeMinutes) return undefined;
    return `${Math.floor(runtimeMinutes / 60)}h ${runtimeMinutes % 60}m`;
  }

  if (!numberOfSeasons) return undefined;
  return `${numberOfSeasons} season${numberOfSeasons !== 1 ? "s" : ""}`;
}

export async function getShowDetail(
  compositeSlug: string
): Promise<ShowDetail | null> {
  const parsed = parseCompositeSlug(compositeSlug);
  if (!parsed) return null;
  const { mediaType, id } = parsed;

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
  const runtimeLabel = formatRuntimeLabel(
    mediaType,
    runtimeMinutes,
    raw.number_of_seasons
  );

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
      const parsed = parseCompositeSlug(composite);
      return parsed ? getShowById(parsed.mediaType, parsed.id) : null;
    })
  );

  return results.filter((s): s is Show => s !== null);
}
