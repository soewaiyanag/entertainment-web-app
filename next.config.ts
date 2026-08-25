import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
  experimental: {
    // Bookmarks/trending/popular are live, mutable data — don't let the
    // client-side Router Cache serve a stale prefetched snapshot of a page
    // (e.g. an empty "no bookmarks yet" captured before the user bookmarks
    // anything) on the next navigation.
    staleTimes: {
      dynamic: 0,
    },
  },
};

export default nextConfig;
