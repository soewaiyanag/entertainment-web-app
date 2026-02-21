import { create } from "zustand";

interface BookmarkState {
  bookmarks: string[];
}

interface BookmarkActions {
  addBookmark: (slug: string) => void;
  removeBookmark: (slug: string) => void;
  setBookmarks: (slugs: string[]) => void;
}

const useBookmark = create<BookmarkState & BookmarkActions>((set) => ({
  bookmarks: [],
  addBookmark: (slug) =>
    set((state) => ({ bookmarks: [...state.bookmarks, slug] })),
  removeBookmark: (slug) =>
    set((state) => ({
      bookmarks: state.bookmarks.filter((b) => b !== slug),
    })),
  setBookmarks: (slugs) => set({ bookmarks: slugs }),
}));

export default useBookmark;
