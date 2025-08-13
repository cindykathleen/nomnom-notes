import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/app/lib/database';
import Nav from '@/app/components/Nav';
import CustomList from './CustomList';

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  if (!session) {
    redirect('/sign-in');
  }

  return (
    <div>
      <Nav />
      <CustomList id={id} />
    </div>
  );
}