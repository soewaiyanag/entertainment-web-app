"use client";

import Image from "next/image";
import useBookmarkStore from "@/stores/bookmark.store";

interface BookmarkButtonProps {
  slug: string;
}

export default function BookmarkButton({ slug }: BookmarkButtonProps) {
  const { bookmarks, addBookmark, removeBookmark } = useBookmarkStore();
  const isBookmarked = bookmarks.includes(slug);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isBookmarked) {
      removeBookmark(slug);
    } else {
      addBookmark(slug);
    }
  }

  return (
    <button
      onClick={handleClick}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      className="size-8 rounded-full bg-blue-950/50 flex items-center justify-center hover:bg-white transition-colors group"
    >
      <Image
        src={
          isBookmarked
            ? "/assets/icon-bookmark-full.svg"
            : "/assets/icon-bookmark-empty.svg"
        }
        width={12}
        height={14}
        alt=""
        className="group-hover:invert"
      />
    </button>
  );
}
