import Link from 'next/link';
import Image from 'next/image';
import { flags } from '@/app/lib/flags';
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
          {flags.socialFeature && (
            <Link href="/social">
              <li className="nav-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor" strokeWidth="2" stroke="currentColor" className="size-8 md:size-9">
                  <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                  <g id="SVGRepo_iconCarrier">
                    <circle cx="22.83" cy="22.57" r="7.51" />
                    <path d="M38,49.94a15.2,15.2,0,0,0-15.21-15.2h0a15.2,15.2,0,0,0-15.2,15.2Z" />
                    <circle cx="44.13" cy="27.22" r="6.05" />
                    <path d="M42.4,49.94h14A12.24,12.24,0,0,0,44.13,37.7h0a12.21,12.21,0,0,0-5.75,1.43" />
                  </g>
                </svg>
              </li>
            </Link>
          )}
          <li data-cy="profile-button">
            <ProfileNav user={user} />
          </li>
        </ul>
      </div>
    </div>
  );
}