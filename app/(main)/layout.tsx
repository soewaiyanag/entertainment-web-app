import Nav from "@/components/layout/nav";
import BookmarkHydrator from "@/components/providers/bookmark-hydrator";
import { PropsWithChildren } from "react";

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen">
      <Nav />
      <BookmarkHydrator />
      <main className="px-4 pt-6 pb-16 md:px-6 lg:pl-[164px] lg:pr-8 lg:pt-16 lg:pb-16">
        {children}
      </main>
      <footer className="px-4 pb-6 md:px-6 lg:pl-[164px] lg:pr-8 lg:pb-8">
        <p className="text-preset-5 text-blue-500">
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </p>
      </footer>
    </div>
  );
}
