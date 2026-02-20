import data from "@/data.json";
import { Show } from "@/types/show.type";
import SearchBar from "@/components/ui/search-bar";
import TrendingCard from "@/components/shows/trending-card";
import ShowCard from "@/components/shows/show-card";

const shows = data as Show[];
const trendingShows = shows.filter((s) => s.isTrending);
const recommendedShows = shows.filter((s) => !s.isTrending);

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6 lg:gap-10">
      {/* Search */}
      <SearchBar />

      {/* Trending */}
      <section className="flex flex-col gap-4 lg:gap-6">
        <h2 className="text-preset-1 text-white">Trending</h2>
        <div className="flex gap-4 lg:gap-10 overflow-x-auto scrollbar-hide -mx-4 px-4 md:-mx-6 md:px-6 lg:-mx-0 lg:px-0">
          {trendingShows.map((show) => (
            <TrendingCard key={show.slug} show={show} />
          ))}
        </div>
      </section>

      {/* Recommended */}
      <section className="flex flex-col gap-4 lg:gap-8">
        <h2 className="text-preset-1 text-white">Recommended for you</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4 md:gap-x-6 lg:gap-x-10 lg:gap-y-6">
          {recommendedShows.map((show) => (
            <ShowCard key={show.slug} show={show} />
          ))}
        </div>
      </section>
    </div>
  );
}
