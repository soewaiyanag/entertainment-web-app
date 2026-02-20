export interface Show {
  slug: string;
  title: string;
  thumbnail: {
    regular: {
      small: string;
      medium: string;
      large: string;
    };
    trending?: {
      small: string;
      large: string;
    };
  };
  year: number;
  category: "Movie" | "TV Series";
  rating: "PG" | "E" | "18+";
  isBookmarked: boolean;
  isTrending: boolean;
}
