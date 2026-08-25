"use client";

import Image from "next/image";
import { useTransition } from "react";
import useBookmarkStore from "@/stores/bookmark.store";
import { toggleBookmarkAction } from "@/app/actions/bookmarks";

interface BookmarkButtonProps {
  slug: string;
  variant?: "icon" | "button";
}

export default function BookmarkButton({
  slug,
  variant = "icon",
}: BookmarkButtonProps) {
  const { bookmarks, addBookmark, removeBookmark } = useBookmarkStore();
  const isBookmarked = bookmarks.includes(slug);
  const [isPending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic update
    if (isBookmarked) {
      removeBookmark(slug);
    } else {
      addBookmark(slug);
    }

    // Persist to DB
    startTransition(async () => {
      await toggleBookmarkAction(slug);
    });
  }

  if (variant === "button") {
    return (
      <button
        onClick={handleClick}
        disabled={isPending}
        className="inline-flex items-center gap-3 w-fit bg-blue-900 border border-blue-500 text-white text-preset-4 rounded-lg px-5 py-3 hover:bg-white hover:text-blue-950 hover:border-white transition-colors group disabled:opacity-75"
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
        {isBookmarked ? "Bookmarked" : "Add to Bookmarks"}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      className="size-8 rounded-full bg-blue-950/50 flex items-center justify-center hover:bg-white transition-colors group disabled:opacity-75"
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
