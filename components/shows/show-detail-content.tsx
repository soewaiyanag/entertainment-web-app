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

function Dot() {
  return <span className="size-[3px] rounded-full bg-white/75 shrink-0" />;
}

export default function ShowDetailContent({ show }: ShowDetailContentProps) {
  const [heroLoaded, setHeroLoaded] = useState(!show.heroImage);
  const categoryIcon = getCategoryIcon(show.category);

  // Fall back to a blurred poster as the backdrop when TMDb has no
  // dedicated backdrop image, so the hero never renders empty.
  const backdropSrc = show.heroImage ?? show.thumbnail.regular.large;

  return (
    <>
      {!heroLoaded && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-blue-950">
          <LoadingScreen />
        </div>
      )}

      <div
        className={`flex flex-col gap-8 lg:gap-12 ${heroLoaded ? "" : "invisible"}`}
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

        {/* Hero */}
        <div className="relative w-full h-[420px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden bg-blue-900">
          <Image
            src={backdropSrc}
            fill
            alt=""
            className={`object-cover ${show.heroImage ? "" : "scale-110 blur-lg opacity-50"}`}
            sizes="100vw"
            priority
            onLoad={() => setHeroLoaded(true)}
            onError={() => setHeroLoaded(true)}
          />

          {/* Gradients for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 via-blue-950/10 to-transparent" />

          {/* Overlaid title/meta/CTA */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 lg:gap-4 p-4 md:p-8 lg:p-12 max-w-2xl">
            <h1 className="text-preset-1 text-white">{show.title}</h1>

            {show.tagline && (
              <p className="text-preset-4 text-white/70 italic">
                {show.tagline}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-[10px] text-preset-4 text-white/90">
              {show.year > 0 && <span>{show.year}</span>}
              <Dot />
              <span className="flex items-center gap-[6px]">
                <Image src={categoryIcon} width={12} height={12} alt="" />
                {show.category}
              </span>
              <Dot />
              <span>{show.rating}</span>
              {show.runtimeLabel && (
                <>
                  <Dot />
                  <span>{show.runtimeLabel}</span>
                </>
              )}
              {show.voteAverage > 0 && (
                <>
                  <Dot />
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
                    className="text-preset-5 text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-1">
              <BookmarkButton slug={show.slug} variant="button" />
            </div>
          </div>
        </div>

        {show.overview && (
          <section className="flex flex-col gap-3 max-w-3xl">
            <h2 className="text-preset-2 text-white">Overview</h2>
            <p className="text-preset-4 text-white/75">{show.overview}</p>
          </section>
        )}

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
    </>
  );
}
