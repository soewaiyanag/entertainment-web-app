"use client";

import { useState } from "react";
import data from "@/data.json";
import { Show } from "@/types/show.type";
import useBookmarkStore from "@/stores/bookmark.store";
import SearchBar from "@/components/ui/search-bar";
import ShowCard from "@/components/shows/show-card";

const allShows = data as Show[];

const GRID = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4 md:gap-x-6 lg:gap-x-10 lg:gap-y-6";

export default function BookmarksPage() {
  const { bookmarks } = useBookmarkStore();
  const [query, setQuery] = useState("");

  const bookmarked = allShows.filter((s) => bookmarks.includes(s.slug));
  const trimmed = query.trim().toLowerCase();

  if (trimmed) {
    const results = bookmarked.filter((s) =>
      s.title.toLowerCase().includes(trimmed)
    );
    return (
      <div className="flex flex-col gap-6 lg:gap-10">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search for bookmarked shows"
        />
        <section className="flex flex-col gap-4 lg:gap-8">
          <h2 className="text-preset-1 text-white">
            Found {results.length} result{results.length !== 1 ? "s" : ""} for
            &apos;{query.trim()}&apos;
          </h2>
          <div className={GRID}>
            {results.map((show) => (
              <ShowCard key={show.slug} show={show} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  const movies = bookmarked.filter((s) => s.category === "Movie");
  const tvSeries = bookmarked.filter((s) => s.category === "TV Series");

  return (
    <div className="flex flex-col gap-6 lg:gap-10">
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search for bookmarked shows"
      />

      {bookmarked.length === 0 && (
        <p className="text-preset-2-light text-white/50 text-center mt-16">
          No bookmarks yet.
        </p>
      )}

      {movies.length > 0 && (
        <section className="flex flex-col gap-4 lg:gap-8">
          <h2 className="text-preset-1 text-white">Bookmarked Movies</h2>
          <div className={GRID}>
            {movies.map((show) => (
              <ShowCard key={show.slug} show={show} />
            ))}
          </div>
        </section>
      )}

      {tvSeries.length > 0 && (
        <section className="flex flex-col gap-4 lg:gap-8">
          <h2 className="text-preset-1 text-white">Bookmarked TV Series</h2>
          <div className={GRID}>
            {tvSeries.map((show) => (
              <ShowCard key={show.slug} show={show} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
