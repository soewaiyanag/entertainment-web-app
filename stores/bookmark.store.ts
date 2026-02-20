import { create } from "zustand";

interface BookmarkState {
  bookmarks: string[];
}

interface BookmarkActions {
  addBookmark: (slug: string) => void;
  removeBookmark: (slug: string) => void;
  setBookmarks: () => void;
}

const useBookmark = create<BookmarkState & BookmarkActions>((set) => ({
  bookmarks: [],
  addBookmark: (slug: string) =>
    set((state) => {
      return {
        bookmarks: [...state.bookmarks, slug],
      };
    }),
  removeBookmark: (slug: string) =>
    set((state) => ({
      bookmarks: state.bookmarks.filter((bookmark) => bookmark !== slug),
    })),
  setBookmarks: () => {},
}));

export default useBookmark;
