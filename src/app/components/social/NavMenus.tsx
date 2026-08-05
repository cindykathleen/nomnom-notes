'use client';

import { useState } from 'react';
import { User } from '@/app/interfaces/interfaces';
import ProfileNav from '../ProfileNav';
import FollowRequestsNav from './FollowRequestsNav';

type NavMenuId = 'follow-requests' | 'profile' | null;

export default function NavMenus({
  user,
  followRequestUsers,
}: {
  user: User;
  followRequestUsers: User[];
}) {
  const [openMenu, setOpenMenu] = useState<NavMenuId>(null);

  return (
    <>
      <FollowRequestsNav
        requests={followRequestUsers}
        open={openMenu === 'follow-requests'}
        onOpenChange={(open) => setOpenMenu(open ? 'follow-requests' : null)}
      />
      <ProfileNav
        user={user}
        open={openMenu === 'profile'}
        onOpenChange={(open) => setOpenMenu(open ? 'profile' : null)}
      />
    </>
  );
}
