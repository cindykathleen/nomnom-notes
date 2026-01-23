'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut } from '@/app/actions/authentication';

export default function Nav() {
  const router = useRouter();

  const handleSignOut = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const result = await signOut();

    if (result.success) {
      router.push('/');
    }
  }

  return (
    <div className="nav-layout">
      <div className="nav-layout-inner">
        <div>
          <Link href="/">
            {/* Mobile logo */}
            <Image src="/logo-mobile.png" alt="NomNom Notes logo"
              width={80} height={51} className="block md:hidden"
            />
            {/* Desktop */}
            <Image src="/logo-desktop.png" alt="NomNom Notes logo"
              width={250} height={64} className="hidden md:block"
            />
          </Link>
        </div>
        <ul className="flex flex-row items-center gap-6 text-md font-semibold md:text-lg">
          <li><Link href="/lists">Lists</Link></li>
          <li><Link href="/search">Search</Link></li>
          <li><Link href="#" onClick={handleSignOut}>Sign out</Link></li>
        </ul>
      </div>
    </div>
  );
}