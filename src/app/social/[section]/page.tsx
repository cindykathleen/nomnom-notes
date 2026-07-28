import Link from 'next/link';
import { notFound } from 'next/navigation';
import getCurrentUser from '@/app/lib/getCurrentUser';
import { getUser, getUsersByIds } from '@/app/lib/dbFunctions';
import Nav from '@/app/components/Nav';
import UserRow from '@/app/components/social/UserRow';
import { newestFirstIds, orderUsersByIds } from '@/app/components/social/Social';

const SECTIONS = {
  requests: {
    title: 'Follower requests',
    emptyMessage: 'No pending follower requests.',
    emptyCy: 'no-follow-requests',
    listCy: undefined as string | undefined,
    field: 'followRequests' as const,
    showActions: true,
  },
  followers: {
    title: 'Followers',
    emptyMessage: 'No followers yet.',
    emptyCy: 'no-followers',
    listCy: 'followers-list',
    field: 'followers' as const,
    showActions: false,
  },
  following: {
    title: 'Following',
    emptyMessage: 'Not following anyone yet.',
    emptyCy: 'no-following',
    listCy: 'following-list',
    field: 'following' as const,
    showActions: false,
  },
} as const;

type SectionKey = keyof typeof SECTIONS;

export default async function Page({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: sectionParam } = await params;

  if (!(sectionParam in SECTIONS)) {
    notFound();
  }

  const section = SECTIONS[sectionParam as SectionKey];
  const userId = await getCurrentUser(false);
  const user = await getUser(userId);

  const ids = newestFirstIds(user?.[section.field] ?? []);
  const users = orderUsersByIds(await getUsersByIds(ids), ids);

  return (
    <div className="outer-layout">
      <Nav userId={userId} />
      <div className="page-layout">
        <div className="page-layout-inner space-y-6 xl:space-y-8">
          <h2>{section.title} ({ids.length})</h2>
          {users.length === 0 ? (
            <p className="subheading" data-cy={section.emptyCy}>
              {section.emptyMessage}
            </p>
          ) : (
            <div
              className="max-w-xl divide-y divide-lightgray"
              data-cy={section.listCy}
            >
              {users.map((u) => (
                <UserRow key={u._id} user={u} showActions={section.showActions} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
