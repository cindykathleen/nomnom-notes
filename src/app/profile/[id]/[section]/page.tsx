import { notFound, redirect } from 'next/navigation';

const ACTIVITY_SECTIONS = new Set(['lists', 'restaurants', 'reviews']);

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; section: string }>;
}) {
  const { id, section } = await params;

  if (!ACTIVITY_SECTIONS.has(section)) {
    notFound();
  }

  redirect(`/profile/${id}/activity?tab=${section}`);
}
