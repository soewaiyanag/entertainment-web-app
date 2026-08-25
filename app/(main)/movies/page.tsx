import CategoryContent from "@/components/shows/category-content";
import { getPopular } from "@/lib/tmdb";

export default async function MoviesPage() {
  const { shows: movies, hasMore } = await getPopular("movie");

  return (
    <CategoryContent
      shows={movies}
      hasMore={hasMore}
      mediaType="movie"
      heading="Movies"
      searchPlaceholder="Search for movies"
    />
  );
}
