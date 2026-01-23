import getCurrentUser from '@/app/lib/getCurrentUser';
import Nav from '@/app/components/Nav';
import DndWrapper from '@/app/components/DndWrapper';
import CustomLists from '@/app/components/CustomLists';

export default async function HomePage() {
  const userId = await getCurrentUser(false);

  return (
    <div>
      <Nav />
      <DndWrapper>
        <CustomLists userId={userId} />
      </DndWrapper>
    </div>
  );
}