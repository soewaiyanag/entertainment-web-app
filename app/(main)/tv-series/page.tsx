import CategoryContent from "@/components/shows/category-content";
import { getPopular } from "@/lib/tmdb";

export default async function TVSeriesPage() {
  const tvSeries = await getPopular("tv");

  return (
    <CategoryContent
      shows={tvSeries}
      mediaType="tv"
      heading="TV Series"
      searchPlaceholder="Search for TV series"
    />
  );
}
