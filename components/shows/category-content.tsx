"use client";

import { useState, useTransition } from "react";
import { Show } from "@/types/show.type";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { loadMoreShowsAction } from "@/app/actions/shows";
import SearchBar from "@/components/ui/search-bar";
import ShowCard from "@/components/shows/show-card";

interface CategoryContentProps {
  shows: Show[];
  hasMore: boolean;
  mediaType: "movie" | "tv";
  heading: string;
  searchPlaceholder: string;
}

export default function CategoryContent({
  shows,
  hasMore,
  mediaType,
  heading,
  searchPlaceholder,
}: CategoryContentProps) {
  const [query, setQuery] = useState("");
  const trimmed = query.trim();
  const { results: searchResults, isPending } = useDebouncedSearch(
    trimmed,
    mediaType
  );

  const [items, setItems] = useState(shows);
  const [page, setPage] = useState(1);
  const [canLoadMore, setCanLoadMore] = useState(hasMore);
  const [isLoadingMore, startLoadingMore] = useTransition();

  function handleLoadMore() {
    startLoadingMore(async () => {
      const nextPage = page + 1;
      const nextResult = await loadMoreShowsAction(mediaType, nextPage);
      setItems((current) => [...current, ...nextResult.shows]);
      setCanLoadMore(nextResult.hasMore);
      setPage(nextPage);
    });
  }

  const displayed = trimmed ? searchResults : items;

  const headingText = !trimmed
    ? heading
    : isPending
      ? "Searching…"
      : `Found ${displayed.length} result${
          displayed.length !== 1 ? "s" : ""
        } for ‘${trimmed}’`;

  return (
    <div className="flex flex-col gap-6 lg:gap-10">
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder={searchPlaceholder}
      />

      <section className="flex flex-col gap-4 lg:gap-8">
        <h2 className="text-preset-1 text-white">{headingText}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4 md:gap-x-6 lg:gap-x-10 lg:gap-y-6">
          {displayed.map((show) => (
            <ShowCard key={show.slug} show={show} />
          ))}
        </div>

        {!trimmed && canLoadMore && (
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="self-center bg-blue-900 border border-blue-500 text-white text-preset-4 rounded-lg px-6 py-3 hover:bg-white hover:text-blue-950 hover:border-white transition-colors disabled:opacity-50"
          >
            {isLoadingMore ? "Loading…" : "Load More"}
          </button>
        )}
      </section>
    </div>
  );
}
