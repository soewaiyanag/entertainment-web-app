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
    </div>
  );
}
