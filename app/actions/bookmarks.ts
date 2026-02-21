"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getBookmarksAction(): Promise<string[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    select: { showSlug: true },
  });

  return bookmarks.map((b) => b.showSlug);
}

export async function toggleBookmarkAction(slug: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  const existing = await prisma.bookmark.findUnique({
    where: {
      userId_showSlug: { userId: session.user.id, showSlug: slug },
    },
  });

  if (existing) {
    await prisma.bookmark.delete({
      where: {
        userId_showSlug: { userId: session.user.id, showSlug: slug },
      },
    });
  } else {
    await prisma.bookmark.create({
      data: { userId: session.user.id, showSlug: slug },
    });
  }
}
