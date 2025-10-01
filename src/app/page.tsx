import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import Link from 'next/link';

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return (
    <div className="relative h-screen w-screen flex flex-col items-center justify-center bg-coolbeige">
      <div className="max-w-[1440px] w-full flex flex-col items-center">
        <div className="w-1/3 text-center">
          <h1 className="text-6xl mb-6 font-semibold">NomNom Notes</h1>
          <p className="mb-6 text-xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris elementum ipsum eget libero iaculis pretium. Sed quis lobortis sapien. Mauris diam justo, ullamcorper sed tortor sit amet, pretium ornare massa.</p>
          { // Set CTA to lists if logged in 
            session && (
              <Link href="/lists">
                <button className="inline-block px-12 py-4 text-xl text-snowwhite font-bold bg-darkpink rounded-lg cursor-pointer
                  hover:bg-mauve transition-colors">
                  View your lists
                </button>
              </Link>
            )
          }
          { // Set CTA to sign up if not logged in
            !session && (
              <Link href="/sign-up">
                <button className="inline-block px-12 py-4 text-xl text-snowwhite font-bold bg-darkpink rounded-lg cursor-pointer
                  hover:bg-mauve transition-colors">
                  Get started
                </button>
              </Link>
            )
          }
        </div>
      </div>
    </div>
  );
}