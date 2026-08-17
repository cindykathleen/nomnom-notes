import Link from 'next/link';
import Image from 'next/image';
import { getUser, getUsersByIds } from '@/app/lib/dbFunctions';
import NavMenus from './social/NavMenus';
import { newestFirstIds, orderUsersByIds } from './social/Social';

export default async function Nav({ userId }: { userId: string }) {
  const user = await getUser(userId);
  const followRequestIds = newestFirstIds(user?.followRequests ?? []);
  const followRequestUsers = orderUsersByIds(
    await getUsersByIds(followRequestIds),
    followRequestIds
  );

  return (
    <div className="nav-layout">
      <div className="nav-layout-inner">
        <div>
          <Link href="/">
            {/* Mobile logo */}
            <Image src="/logo-mobile.png" alt="NomNom Notes logo"
              width={70} height={45} className="block md:hidden"
            />
            {/* Desktop */}
            <Image src="/logo-desktop.png" alt="NomNom Notes logo"
              width={200} height={41} className="hidden md:block"
            />
          </Link>
        </div>
        <ul className="flex flex-row items-center gap-4">
          <Link href="/lists">
            <li className="nav-button">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 md:size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
              </svg>
            </li>
          </Link>
          <Link href="/rankings">
            <li className="nav-button">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 md:size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.242 5.992h12m-12 6.003H20.24m-12 5.999h12M4.117 7.495v-3.75H2.99m1.125 3.75H2.99m1.125 0H5.24m-1.92 2.577a1.125 1.125 0 1 1 1.591 1.59l-1.83 1.83h2.16M2.99 15.745h1.125a1.125 1.125 0 0 1 0 2.25H3.74m0-.002h.375a1.125 1.125 0 0 1 0 2.25H2.99" />
              </svg>
            </li>
          </Link>
          <NavMenus user={user} followRequestUsers={followRequestUsers} />
        </ul>
      </div>
    </div>
  );
}
