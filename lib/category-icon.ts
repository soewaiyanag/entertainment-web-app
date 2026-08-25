import { Show } from "@/types/show.type";

export function getCategoryIcon(category: Show["category"]): string {
  return category === "Movie"
    ? "/assets/icon-category-movie.svg"
    : "/assets/icon-category-tv.svg";
}
