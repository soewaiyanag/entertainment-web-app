"use client";

import { useEffect, useState, useTransition } from "react";
import { Show } from "@/types/show.type";
import { searchShowsAction } from "@/app/actions/shows";

const DEBOUNCE_MS = 400;

// Debounces `query` and calls searchShowsAction once typing settles, so
// callers just render `results`/`isPending` instead of wiring up their own
// timeout + useTransition + effect each time.
export function useDebouncedSearch(query: string, mediaType?: "movie" | "tv") {
  const [results, setResults] = useState<Show[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!query) return;

    const timeout = setTimeout(() => {
      startTransition(async () => {
        const shows = await searchShowsAction(query, mediaType);
        setResults(shows);
      });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [query, mediaType]);

  return { results, isPending };
}
