import getCurrentUser from '@/app/lib/getCurrentUser';
import Nav from '@/app/components/Nav';
import DndWrapper from '@/app/components/DndWrapper';
import CustomRestaurant from './CustomRestaurant';

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  const userId = await getCurrentUser();

  return (
    <div>
      <Nav />
      <DndWrapper>
        <CustomRestaurant userId={userId} restaurantId={id} />
      </DndWrapper>
    </div>
  );
}
