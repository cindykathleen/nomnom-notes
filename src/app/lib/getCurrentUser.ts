import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function getCurrentUser(isPublic: boolean) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!isPublic) {
    if (!session) {
      const h = await headers();
      const path = h.get('x-invoke-path') || '';
      const redirectUrl = encodeURIComponent(`/${path}`);

      redirect(`/sign-in?redirect=${redirectUrl}`);
    }

    return session.user.id;
  }

  return session?.user.id ?? 'public';
}