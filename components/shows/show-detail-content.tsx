"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShowDetail } from "@/lib/tmdb";
import { getCategoryIcon } from "@/lib/category-icon";
import BookmarkButton from "./bookmark-button";
import LoadingScreen from "./loading-screen";

interface ShowDetailContentProps {
  show: ShowDetail;
}

export default function ShowDetailContent({ show }: ShowDetailContentProps) {
  const [heroLoaded, setHeroLoaded] = useState(!show.heroImage);
  const [posterLoaded, setPosterLoaded] = useState(false);
  const ready = heroLoaded && posterLoaded;

  const categoryIcon = getCategoryIcon(show.category);

  return (
    <div className="relative min-h-[60vh]">
      {!ready && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-blue-950">
          <LoadingScreen />
        </div>
      )}

      <div
        className={`flex flex-col gap-6 lg:gap-10 ${ready ? "" : "invisible"}`}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-preset-4 text-white/75 hover:text-white transition-colors w-fit"
        >
          <svg
            width="8"
            height="14"
            viewBox="0 0 8 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 1 1 7l6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </Link>

        {/* Hero backdrop */}
        {show.heroImage && (
          <div className="relative w-full h-[180px] md:h-[320px] lg:h-[420px] rounded-lg overflow-hidden">
            <Image
              src={show.heroImage}
              fill
              alt=""
              className="object-cover"
              sizes="100vw"
              priority
              onLoad={() => setHeroLoaded(true)}
              onError={() => setHeroLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/10 to-transparent" />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6 lg:gap-10">
          {/* Poster */}
          <div
            className={`relative w-[140px] md:w-[200px] lg:w-[240px] aspect-[2/3] rounded-lg overflow-hidden shrink-0 mx-auto md:mx-0 ring-4 ring-blue-950 ${
              show.heroImage ? "-mt-16 md:-mt-24 lg:-mt-32" : ""
            }`}
          >
            <Image
              src={show.thumbnail.regular.large}
              fill
              alt={show.title}
              className="object-cover"
              sizes="240px"
              onLoad={() => setPosterLoaded(true)}
              onError={() => setPosterLoaded(true)}
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4 lg:gap-6 flex-1 min-w-0">
            <div className="flex flex-col gap-2">
              <h1 className="text-preset-1 text-white">{show.title}</h1>
              {show.tagline && (
                <p className="text-preset-4 text-blue-500 italic">
                  {show.tagline}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-[10px] text-preset-4 text-white/75">
              {show.year > 0 && <span>{show.year}</span>}
              <span className="size-[3px] rounded-full bg-white/75 shrink-0" />
              <span className="flex items-center gap-[6px]">
                <Image src={categoryIcon} width={12} height={12} alt="" />
                {show.category}
              </span>
              <span className="size-[3px] rounded-full bg-white/75 shrink-0" />
              <span>{show.rating}</span>
              {show.runtimeLabel && (
                <>
                  <span className="size-[3px] rounded-full bg-white/75 shrink-0" />
                  <span>{show.runtimeLabel}</span>
                </>
              )}
              {show.voteAverage > 0 && (
                <>
                  <span className="size-[3px] rounded-full bg-white/75 shrink-0" />
                  <span className="text-white">
                    ★ {show.voteAverage.toFixed(1)}
                  </span>
                </>
              )}
            </div>

            {show.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {show.genres.map((genre) => (
                  <span
                    key={genre}
                    className="text-preset-5 text-white/75 bg-blue-900 border border-blue-500 rounded-full px-3 py-1"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            <BookmarkButton slug={show.slug} variant="button" />

            {show.overview && (
              <p className="text-preset-4 text-white/75 max-w-prose">
                {show.overview}
              </p>
            )}
          </div>
        </div>

        {show.cast.length > 0 && (
          <section className="flex flex-col gap-4 lg:gap-6">
            <h2 className="text-preset-2 text-white">Cast</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4 md:-mx-6 md:px-6 lg:mx-0 lg:px-0">
              {show.cast.map((member, i) => (
                <div
                  key={`${member.name}-${i}`}
                  className="flex flex-col items-center gap-2 w-[84px] shrink-0 text-center"
                >
                  <div className="relative size-[72px] rounded-full overflow-hidden bg-blue-900">
                    {member.profileImage && (
                      <Image
                        src={member.profileImage}
                        fill
                        alt={member.name}
                        className="object-cover"
                        sizes="72px"
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-preset-5 text-white truncate w-[84px]">
                      {member.name}
                    </p>
                    <p className="text-preset-6 text-blue-500 truncate w-[84px]">
                      {member.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
