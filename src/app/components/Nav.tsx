import Link from 'next/link';

export const Nav = () => {
  return (
    <div className="fixed top-0 h-[80px] w-full flex items-center justify-center z-99 bg-coolbeige">
      <div className="max-w-[1440px] w-full px-8 flex justify-between">
        <div>
          <Link href="/" className="text-2xl font-bold">NomNom Notes</Link>
        </div>
        <ul className="flex flex-row items-center gap-6 text-lg font-semibold">
          <li><Link href="/lists/">Lists</Link></li>
          <li><Link href="/search/">Search</Link></li>
        </ul>
      </div>
    </div>
  );
}