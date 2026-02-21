"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { logoutAction } from "@/app/actions/auth";

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
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    startTransition(async () => {
      await logoutAction();
    });
  }

  return (
    <nav
      className="
      sticky top-0 z-50 bg-blue-900
      flex items-center justify-between
      px-4 py-5 w-full
      lg:fixed lg:left-8 lg:top-8 lg:bottom-8 lg:w-24
      lg:flex-col lg:justify-between
      lg:px-0 lg:py-8 lg:rounded-[20px]
    "
    >
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
                isActive ? "opacity-100" : "opacity-50 hover:opacity-100"
              }`}
            >
              <Image src={item.src} width={20} height={20} alt={item.label} />
            </Link>
          );
        })}
      </div>

      {/* Avatar + logout popup */}
      <div ref={avatarRef} className="relative shrink-0">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="User menu"
          className="size-8 cursor-pointer lg:size-10 rounded-full border border-white overflow-hidden block"
        >
          <Image
            src="/assets/image-avatar.png"
            width={40}
            height={40}
            alt="User avatar"
            className="object-cover w-full h-full"
          />
        </button>

        {open && (
          <div
            className="
            absolute z-50 bg-blue-900 border border-blue-500 rounded-lg overflow-hidden
            right-0 top-10
            lg:left-full lg:top-auto lg:bottom-0 lg:ml-3 lg:right-auto
          "
          >
            <button
              onClick={handleLogout}
              disabled={isPending}
              className="flex cursor-pointer items-center gap-3 px-4 py-3 text-white text-preset-5 hover:bg-blue-500/20 transition-colors w-full whitespace-nowrap disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-75 shrink-0"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              {isPending ? "Logging out…" : "Logout"}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
