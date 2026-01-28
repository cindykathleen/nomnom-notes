import Link from 'next/link';
import Image from 'next/image';
import { User } from '@/app/interfaces/interfaces';
import getCurrentUser from '@/app/lib/getCurrentUser';

export default async function Hero({ user }: { user: User }) {
  const currentUser = await getCurrentUser(false);

  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-8">
        <Image src={user.photoUrl} alt={`${user.name}'s profile picture`} width={200} height={200}
          className="rounded-full aspect-square object-cover"
        />
        <div className="flex flex-col gap-2">
          <h1 className="page-heading">{user.name}</h1>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            <h2 className="font-xl semi-bold">{user.location}</h2>
          </div>
        </div>
      </div>
      { // Only show the 'Edit profile' button if the current user is viewing their own profile
        currentUser === user._id && (
          <Link href='/settings#profile'>
            <button className="button-secondary flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
              Edit profile
            </button>
          </Link>
        )
      }
    </div>
  );
}