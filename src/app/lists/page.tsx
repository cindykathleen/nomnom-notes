import getCurrentUser from '@/app/lib/getCurrentUser';
import Nav from '@/app/components/Nav';
import DndWrapper from '@/app/components/DndWrapper';
import CustomLists from '@/app/lists/CustomLists';

export default async function Page() {
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