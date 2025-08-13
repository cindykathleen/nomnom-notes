import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { redirect } from "next/navigation";
import Nav from '@/app/components/Nav';
import DndWrapper from '@/app/components/DndWrapper';
import CustomRestaurant from './CustomRestaurant';

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
      <DndWrapper>
        <CustomRestaurant id={id} />
      </DndWrapper>
    </div>
  );
}
