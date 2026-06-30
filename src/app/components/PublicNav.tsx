import Link from 'next/link';
import Image from 'next/image';

export default function Nav() {
  return (
    <div className="nav-layout">
      <div className="nav-layout-inner">
      <div>
          <Link href="/about">
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
          <Link href="/sign-in">
            <li className="nav-button-text">
              Sign In
            </li>
          </Link>
          <Link href="/sign-up">
            <li className="nav-button-text text-snowwhite bg-darkpink">
              Sign Up
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
}