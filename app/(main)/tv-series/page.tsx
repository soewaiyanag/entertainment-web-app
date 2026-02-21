import data from "@/data.json";
import { Show } from "@/types/show.type";
import CategoryContent from "@/components/shows/category-content";

const tvSeries = (data as Show[]).filter((s) => s.category === "TV Series");

export default function TVSeriesPage() {
  return (
    <CategoryContent
      shows={tvSeries}
      heading="TV Series"
      searchPlaceholder="Search for TV series"
    />
  );
}
