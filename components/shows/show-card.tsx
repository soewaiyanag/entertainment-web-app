"use client";

import Image from "next/image";
import { Show } from "@/types/show.type";
import BookmarkButton from "./bookmark-button";

interface ShowCardProps {
  show: Show;
}

export default function ShowCard({ show }: ShowCardProps) {
  const categoryIcon =
    show.category === "Movie"
      ? "/assets/icon-category-movie.svg"
      : "/assets/icon-category-tv.svg";

  const imageSrc = show.thumbnail.regular.large.replace("./", "/");

  return (
    <div className="flex flex-col gap-2">
      {/* Image */}
      <div className="relative w-full h-[110px] md:h-[140px] lg:h-[174px] rounded-lg overflow-hidden group">
        <Image
          src={imageSrc}
          fill
          alt={show.title}
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 280px"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        {/* Bookmark */}
        <div className="absolute top-2 right-2">
          <BookmarkButton slug={show.slug} />
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-[6px] text-preset-5 text-white/75">
          <span>{show.year}</span>
          <span className="size-[3px] rounded-full bg-white/75 shrink-0" />
          <span className="flex items-center gap-[6px]">
            <Image
              src={categoryIcon}
              width={12}
              height={12}
              alt=""
            />
            {show.category}
          </span>
          <span className="size-[3px] rounded-full bg-white/75 shrink-0" />
          <span>{show.rating}</span>
        </div>
        <p className="text-preset-3 text-white">{show.title}</p>
      </div>
    </div>
  );
}
