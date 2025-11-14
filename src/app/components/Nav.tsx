import Link from 'next/link';

export default function Nav() {
  return (
    <div className="nav-layout">
      <div className="nav-layout-inner">
        <div>
          <Link href="/" className="text-xl font-bold md:text-2xl">NomNom Notes</Link>
        </div>
        <ul className="flex flex-row items-center gap-6 text-md font-semibold md:text-lg">
          <li><Link href="/lists">Lists</Link></li>
          <li><Link href="/search">Search</Link></li>
        </ul>
      </div>
    </div>
  );
}