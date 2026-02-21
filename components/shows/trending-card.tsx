"use client";

import Image from "next/image";
import { Show } from "@/types/show.type";
import BookmarkButton from "./bookmark-button";

interface TrendingCardProps {
  show: Show;
}

export default function TrendingCard({ show }: TrendingCardProps) {
  const categoryIcon =
    show.category === "Movie"
      ? "/assets/icon-category-movie.svg"
      : "/assets/icon-category-tv.svg";

  const imageSrc = show.thumbnail.trending!.large.replace("./", "/");

  return (
    <div className="relative shrink-0 w-[240px] h-[140px] md:w-[470px] md:h-[230px] rounded-lg overflow-hidden">
      {/* Background image */}
      <Image
        src={imageSrc}
        fill
        alt={show.title}
        className="object-cover"
        sizes="(max-width: 768px) 240px, 470px"
      />

      {/* Bookmark button */}
      <div className="absolute top-2 right-2 md:top-4 md:right-6">
        <BookmarkButton slug={show.slug} />
      </div>

      {/* Gradient + info overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-[70px] md:h-[100px] bg-gradient-to-b from-transparent to-black/75 rounded-b-lg flex flex-col justify-end p-2 md:px-6 md:pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-[6px] text-preset-4 text-white/75">
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
          <p className="text-preset-2 text-white">{show.title}</p>
        </div>
      </div>
    </div>
  );
}
