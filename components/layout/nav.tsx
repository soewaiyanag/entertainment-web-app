"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", src: "/assets/icon-nav-home.svg", label: "Home" },
  { href: "/movies", src: "/assets/icon-nav-movies.svg", label: "Movies" },
  {
    href: "/tv-series",
    src: "/assets/icon-nav-tv-series.svg",
    label: "TV Series",
  },
  {
    href: "/bookmarks",
    src: "/assets/icon-nav-bookmark.svg",
    label: "Bookmarks",
  },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="
      sticky top-0 z-50 bg-blue-900
      flex items-center justify-between
      px-4 py-5 w-full
      lg:fixed lg:left-8 lg:top-8 lg:bottom-8 lg:w-24
      lg:flex-col lg:justify-between
      lg:px-0 lg:py-8 lg:rounded-[20px]
    ">
      {/* Logo */}
      <Link href="/">
        <Image
          src="/assets/logo.svg"
          width={32}
          height={26}
          alt="Entertainment App"
        />
      </Link>

      {/* Nav icons */}
      <div className="flex items-center gap-6 lg:flex-col lg:gap-10">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={`transition-opacity ${
                isActive
                  ? "opacity-100"
                  : "opacity-50 hover:opacity-100"
              }`}
            >
              <Image
                src={item.src}
                width={20}
                height={20}
                alt={item.label}
              />
            </Link>
          );
        })}
      </div>

      {/* Avatar */}
      <div className="relative size-8 lg:size-10 rounded-full border border-white overflow-hidden shrink-0">
        <Image
          src="/assets/image-avatar.png"
          fill
          alt="User avatar"
          className="object-cover"
        />
      </div>
    </nav>
  );
}
