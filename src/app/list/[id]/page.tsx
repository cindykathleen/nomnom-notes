import { getListVisibility } from '@/app/lib/dbFunctions';
import getCurrentUser from '@/app/lib/getCurrentUser';
import PublicNav from '@/app/components/PublicNav';
import Nav from '@/app/components/Nav';
import CustomList from './CustomList';

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ query?: string }>;

export default async function Page({ params, searchParams }: { params: Params, searchParams: SearchParams }) {
  const { id } = await params;
  const { query } = await searchParams;

  const isPublic = await getListVisibility(id) === 'public';
  const userId = await getCurrentUser(isPublic);

  return (
    <div>
      { // Display a different nav bar for public users
        userId === 'public' ? <PublicNav /> : <Nav userId={userId} />
      }
      <CustomList userId={userId} listId={id} query={query} />
    </div>
  );
}