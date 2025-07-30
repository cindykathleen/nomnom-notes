import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { redirect } from "next/navigation";
import SearchPage from './SearchPage';

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  return <SearchPage />;
}