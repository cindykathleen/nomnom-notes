import { db } from '@/app/lib/database';
import getCurrentUser from '@/app/lib/getCurrentUser';
import PublicNav from '@/app/components/PublicNav';
import Nav from '@/app/components/Nav';
import DndWrapper from '@/app/components/DndWrapper';
import CustomRestaurant from './CustomRestaurant';

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;

  let list;

  try {
    list = await db.getListByRestaurantId(id);

    if (!list) {
      return { error: 'Error fetching list' };
    }
  } catch (err) {
    return { error: `Error fetching list: ${err}` };
  }

  const isPublic = await db.getListVisibility(list._id) === 'public';
  const userId = await getCurrentUser(isPublic);

  return (
    <div>
      { // Display a different nav bar for public users
        userId === 'public' ? <PublicNav /> : <Nav />
      }
      <DndWrapper>
        <CustomRestaurant userId={userId} list={list} restaurantId={id} />
      </DndWrapper>
    </div>
  );
}
