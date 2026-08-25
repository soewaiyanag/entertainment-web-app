"use client";

import Image from "next/image";
import Link from "next/link";
import { Show } from "@/types/show.type";
import { getCategoryIcon } from "@/lib/category-icon";
import BookmarkButton from "./bookmark-button";

interface TrendingCardProps {
  show: Show;
}

export default function TrendingCard({ show }: TrendingCardProps) {
  const categoryIcon = getCategoryIcon(show.category);
  const imageSrc = show.thumbnail.trending!.large;

  return (
    <Link
      href={`/show/${show.slug}`}
      className="relative block shrink-0 w-[240px] h-[140px] md:w-[470px] md:h-[230px] rounded-lg overflow-hidden group"
    >
      {/* Background image */}
      <Image
        src={imageSrc}
        fill
        alt={show.title}
        className="object-cover"
        sizes="(max-width: 768px) 240px, 470px"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

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
    </Link>
  );
}
