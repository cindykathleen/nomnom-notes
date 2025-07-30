'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="relative h-screen w-screen flex flex-col items-center bg-coolbeige">
      <div className="max-w-[1440px] w-full flex flex-col items-center">
        <div className="w-1/3 mt-40 text-center">
          <h1 className="text-6xl mb-6 font-semibold">NomNom Notes</h1>
          <p className="mb-6 text-xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris elementum ipsum eget libero iaculis pretium. Sed quis lobortis sapien. Mauris diam justo, ullamcorper sed tortor sit amet, pretium ornare massa.</p>
          <Link href="/sign-up/"
            className="inline-block px-12 py-4 text-xl text-snowwhite font-bold bg-darkpink rounded-lg hover:bg-mauve transition-colors">
            Get started
          </Link>
        </div>
      </div>
      <div className="absolute bottom-0">
        <img src="homepage_laptop-screen_640x360.png" alt="Laptop screen with NomNom Notes app" width="640" height="360" />
      </div>
    </div>
  );
}