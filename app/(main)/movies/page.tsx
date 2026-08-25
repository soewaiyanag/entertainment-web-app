import CategoryContent from "@/components/shows/category-content";
import { getPopular } from "@/lib/tmdb";

export default async function MoviesPage() {
  const movies = await getPopular("movie");

  return (
    <CategoryContent
      shows={movies}
      mediaType="movie"
      heading="Movies"
      searchPlaceholder="Search for movies"
    />
  );
}
