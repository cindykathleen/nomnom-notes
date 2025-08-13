import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Nav from '@/app/components/Nav';
import DndWrapper from '@/app/components/DndWrapper';
import CustomLists from '@/app/lists/CustomLists';

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  if (!session) {
    redirect('/sign-in');
  }

  return (
    <div>
      <Nav />
      <DndWrapper>
        <CustomLists />
      </DndWrapper>
    </div>
  );
}