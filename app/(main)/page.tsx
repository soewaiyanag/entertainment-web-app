import HomeContent from "@/components/home/home-content";
import { getPopular, getTrending } from "@/lib/tmdb";

export default async function HomePage() {
  const [trendingShows, popularMovies, popularTV] = await Promise.all([
    getTrending(),
    getPopular("movie"),
    getPopular("tv"),
  ]);

  const recommendedShows = [...popularMovies.shows, ...popularTV.shows];

  return (
    <HomeContent
      trendingShows={trendingShows}
      recommendedShows={recommendedShows}
    />
  );
}
