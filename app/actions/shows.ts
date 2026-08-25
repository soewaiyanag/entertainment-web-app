"use server";

import { getShowsByCompositeIds, searchShows } from "@/lib/tmdb";
import { Show } from "@/types/show.type";

export async function searchShowsAction(
  query: string,
  mediaType?: "movie" | "tv"
): Promise<Show[]> {
  return searchShows(query, mediaType);
}

export async function getBookmarkedShowsAction(
  slugs: string[]
): Promise<Show[]> {
  return getShowsByCompositeIds(slugs);
}
