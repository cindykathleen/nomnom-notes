import { getListVisibility } from '@/app/lib/dbFunctions';
import getCurrentUser from '@/app/lib/getCurrentUser';
import PublicNav from '@/app/components/PublicNav';
import Nav from '@/app/components/Nav';
import CustomList from './CustomList';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const isPublic = await getListVisibility(id) === 'public';
  const userId = await getCurrentUser(isPublic);

  return (
    <div>
      { // Display a different nav bar for public users
        userId === 'public' ? <PublicNav /> : <Nav />
      }
      <CustomList userId={userId} listId={id} />
    </div>
  );
}