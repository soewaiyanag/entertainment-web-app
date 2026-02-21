import data from "@/data.json";
import { Show } from "@/types/show.type";
import CategoryContent from "@/components/shows/category-content";

const movies = (data as Show[]).filter((s) => s.category === "Movie");

export default function MoviesPage() {
  return (
    <CategoryContent
      shows={movies}
      heading="Movies"
      searchPlaceholder="Search for movies"
    />
  );
}
