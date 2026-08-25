import { notFound } from "next/navigation";
import { getShowDetail } from "@/lib/tmdb";
import ShowDetailContent from "@/components/shows/show-detail-content";

interface ShowPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ShowPage({ params }: ShowPageProps) {
  const { slug } = await params;
  const show = await getShowDetail(slug);

  if (!show) notFound();

  return <ShowDetailContent show={show} />;
}
