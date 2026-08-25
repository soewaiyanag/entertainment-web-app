"use client";

import { useEffect, useState, useTransition } from "react";
import { Show } from "@/types/show.type";
import { searchShowsAction } from "@/app/actions/shows";
import SearchBar from "@/components/ui/search-bar";
import ShowCard from "@/components/shows/show-card";

interface CategoryContentProps {
  shows: Show[];
  mediaType: "movie" | "tv";
  heading: string;
  searchPlaceholder: string;
}

export default function CategoryContent({
  shows,
  mediaType,
  heading,
  searchPlaceholder,
}: CategoryContentProps) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Show[]>([]);
  const [isPending, startTransition] = useTransition();

  const trimmed = query.trim();

  useEffect(() => {
    if (!trimmed) return;

    const timeout = setTimeout(() => {
      startTransition(async () => {
        const results = await searchShowsAction(trimmed, mediaType);
        setSearchResults(results);
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, [trimmed, mediaType]);

  const displayed = trimmed ? searchResults : shows;

  return (
    <div className="flex flex-col gap-6 lg:gap-10">
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder={searchPlaceholder}
      />

      <section className="flex flex-col gap-4 lg:gap-8">
        <h2 className="text-preset-1 text-white">
          {trimmed
            ? isPending
              ? "Searching…"
              : `Found ${displayed.length} result${
                  displayed.length !== 1 ? "s" : ""
                } for ‘${trimmed}’`
            : heading}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4 md:gap-x-6 lg:gap-x-10 lg:gap-y-6">
          {displayed.map((show) => (
            <ShowCard key={show.slug} show={show} />
          ))}
        </div>
      </section>
    </div>
  );
}
