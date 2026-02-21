"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { logoutAction } from "@/app/actions/auth";

function IconHome() {
  return (
    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 0H1C.4 0 0 .4 0 1v7c0 .6.4 1 1 1h7c.6 0 1-.4 1-1V1c0-.6-.4-1-1-1Zm0 11H1c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h7c.6 0 1-.4 1-1v-7c0-.6-.4-1-1-1ZM19 0h-7c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h7c.6 0 1-.4 1-1V1c0-.6-.4-1-1-1Zm0 11h-7c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h7c.6 0 1-.4 1-1v-7c0-.6-.4-1-1-1Z" fill="currentColor" />
    </svg>
  );
}

function IconMovies() {
  return (
    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.956 0H3.044A3.044 3.044 0 0 0 0 3.044v13.912A3.044 3.044 0 0 0 3.044 20h13.912A3.044 3.044 0 0 0 20 16.956V3.044A3.044 3.044 0 0 0 16.956 0ZM4 9H2V7h2v2Zm-2 2h2v2H2v-2Zm16-2h-2V7h2v2Zm-2 2h2v2h-2v-2Zm2-8.26V4h-2V2h1.26a.74.74 0 0 1 .74.74ZM2.74 2H4v2H2V2.74A.74.74 0 0 1 2.74 2ZM2 17.26V16h2v2H2.74a.74.74 0 0 1-.74-.74Zm16 0a.74.74 0 0 1-.74.74H16v-2h2v1.26Z" fill="currentColor" />
    </svg>
  );
}

function IconTVSeries() {
  return (
    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4.481H9.08l2.7-3.278L10.22 0 7 3.909 3.78.029 2.22 1.203l2.7 3.278H0V20h20V4.481Zm-8 13.58H2V6.42h10v11.64Zm5-3.88h-2v-1.94h2v1.94Zm0-3.88h-2V8.36h2v1.94Z" fill="currentColor" />
    </svg>
  );
}

function IconBookmark() {
  return (
    <svg width="17" height="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.387 0c.202 0 .396.04.581.119.291.115.522.295.694.542.172.247.258.52.258.82v17.038c0 .3-.086.573-.258.82a1.49 1.49 0 0 1-.694.542 1.49 1.49 0 0 1-.581.106c-.423 0-.79-.141-1.098-.423L8.46 13.959l-5.83 5.605c-.317.29-.682.436-1.097.436-.202 0-.396-.04-.581-.119a1.49 1.49 0 0 1-.694-.542A1.402 1.402 0 0 1 0 18.52V1.481c0-.3.086-.573.258-.82A1.49 1.49 0 0 1 .952.119C1.137.039 1.33 0 1.533 0h13.854Z" fill="currentColor" />
    </svg>
  );
}

const NAV_ITEMS = [
  { href: "/", label: "Home", Icon: IconHome },
  { href: "/movies", label: "Movies", Icon: IconMovies },
  { href: "/tv-series", label: "TV Series", Icon: IconTVSeries },
  { href: "/bookmarks", label: "Bookmarks", Icon: IconBookmark },
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
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={`transition-colors ${
                isActive
                  ? "text-red-500"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <Icon />
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
          <div className="
            absolute z-50 bg-blue-900 border border-blue-500 rounded-lg overflow-hidden
            right-0 top-10
            lg:left-full lg:top-auto lg:bottom-0 lg:ml-3 lg:right-auto
          ">
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
