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
        <ul className="flex flex-row items-center gap-4">
          <Link href="/sign-in" className="button-secondary text-center">
            <li>Sign In</li>
          </Link>
          <Link href="/sign-up" className="button-primary text-center">
            <li>Sign Up</li>
          </Link>
        </ul>
      </div>
    </div>
  );
}