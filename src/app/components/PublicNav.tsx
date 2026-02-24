import Link from 'next/link';
import Image from 'next/image';

export default function Nav() {
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
        <ul className="flex flex-row items-center gap-6 text-md font-semibold md:text-lg">
          <li><Link href="/sign-in">Sign In</Link></li>
          <li><Link href="/sign-up">Sign Up</Link></li>
        </ul>
      </div>
    </div>
  );
}