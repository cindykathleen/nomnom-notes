import getCurrentUser from '@/app/lib/getCurrentUser';
import Nav from '@/app/components/Nav';
import CustomList from './CustomList';

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  
  const userId = await getCurrentUser();

  return (
    <div>
      <Nav />
      <CustomList userId={userId} listId={id} />
    </div>
  );
}