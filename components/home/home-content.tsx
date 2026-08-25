"use client";

import { useState } from "react";
import { Show } from "@/types/show.type";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import SearchBar from "@/components/ui/search-bar";
import TrendingCard from "@/components/shows/trending-card";
import ShowCard from "@/components/shows/show-card";

interface HomeContentProps {
  trendingShows: Show[];
  recommendedShows: Show[];
}

export default function HomeContent({
  trendingShows,
  recommendedShows,
}: HomeContentProps) {
  const [query, setQuery] = useState("");
  const trimmed = query.trim();
  const { results: searchResults, isPending } = useDebouncedSearch(trimmed);

  return (
    <div className="flex flex-col gap-6 lg:gap-10">
      <SearchBar value={query} onChange={setQuery} />

      {trimmed ? (
        <section className="flex flex-col gap-4 lg:gap-8">
          <h2 className="text-preset-1 text-white">
            {isPending
              ? "Searching…"
              : `Found ${searchResults.length} result${
                  searchResults.length !== 1 ? "s" : ""
                } for ‘${trimmed}’`}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4 md:gap-x-6 lg:gap-x-10 lg:gap-y-6">
            {searchResults.map((show) => (
              <ShowCard key={show.slug} show={show} />
            ))}
          </div>
        </section>
      ) : (
        <>
          <section className="flex flex-col gap-4 lg:gap-6">
            <h2 className="text-preset-1 text-white">Trending</h2>
            <div className="flex gap-4 md:gap-10 overflow-x-auto scrollbar-hide -mx-4 px-4 md:-mx-6 md:px-6 lg:mx-0 lg:px-0">
              {trendingShows.map((show) => (
                <TrendingCard key={show.slug} show={show} />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4 lg:gap-8">
            <h2 className="text-preset-1 text-white">Recommended for you</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4 md:gap-x-6 lg:gap-x-10 lg:gap-y-6">
              {recommendedShows.map((show) => (
                <ShowCard key={show.slug} show={show} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
