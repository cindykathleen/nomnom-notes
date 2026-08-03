import { redirect, notFound } from 'next/navigation';
import getCurrentUser from '@/app/lib/getCurrentUser';

const REDIRECT_SECTIONS = new Set(['followers', 'following']);

export default async function Page({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const userId = await getCurrentUser(false);

  if (section === 'requests') {
    redirect('/');
  }

  if (!REDIRECT_SECTIONS.has(section)) {
    notFound();
  }

  redirect(`/profile/${userId}/social?tab=${section}`);
}
