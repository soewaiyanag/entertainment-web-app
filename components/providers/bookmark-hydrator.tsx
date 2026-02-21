"use client";

import { useEffect } from "react";
import useBookmarkStore from "@/stores/bookmark.store";
import { getBookmarksAction } from "@/app/actions/bookmarks";

export default function BookmarkHydrator() {
  const setBookmarks = useBookmarkStore((s) => s.setBookmarks);

  useEffect(() => {
    getBookmarksAction().then(setBookmarks);
  }, [setBookmarks]);

  return null;
}
