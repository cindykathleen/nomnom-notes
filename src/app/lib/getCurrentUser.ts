import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function getCurrentUser(isPublic: boolean) {
  const session = await auth.api.getSession({
      headers: await headers()
    });
 
  if (!isPublic) {
    if (!session) {
      redirect('/sign-in');
    }

    return session.user.id;
  }

  return session?.user.id ?? 'public';
}