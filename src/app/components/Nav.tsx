import Link from 'next/link';
import Image from 'next/image';
import { getUser } from '@/app/lib/dbFunctions';
import ProfileNav from './ProfileNav';

export default async function Nav({ userId }: { userId: string }) {
  const user = await getUser(userId);

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
          <Link href="/">
            <li className="nav-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 md:size-6">
                <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
              </svg>
            </li>
          </Link>
          <li data-cy="profile-button">
            <ProfileNav user={user} />
          </li>
        </ul>
      </div>
    </div>
  );
}