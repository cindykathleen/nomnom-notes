import { isOwnerOrCollaboratorDb, getRestaurant, getDish } from '@/app/lib/dbFunctions';
import { List, Dish } from '@/app/interfaces/interfaces';
import Link from 'next/link';
import getAvgRating from '@/app/lib/getAvgRating';
import RatingDisplay from '@/app/components/RatingDisplay';
import DishCard from './DishCard';
import DishAddCard from './DishAddCard';

export default async function CustomRestaurant({ userId, list, restaurantId }: { userId: string, list: List, restaurantId: string }) {
  const isOwnerOrCollaborator = await isOwnerOrCollaboratorDb(userId, list._id);

  let restaurant;

  try {
    restaurant = await getRestaurant(restaurantId);

    if (!restaurant) {
      return <div>Error fetching restaurant</div>;
    }
  } catch (err) {
    return <div>Error fetching restaurant</div>;
  }

  let dishes: Dish[] = [];

  try {
    dishes = await Promise.all(
      restaurant.dishes.map(async (dishId) => {
        const dish = await getDish(dishId);

        if (!dish) {
          throw new Error(`Dish with ID ${dishId} not found`);
        }

        return dish;
      })
    );
  } catch (err) {
    return <div>Error fetching dishes</div>;
  }

  dishes.sort((a, b) => a.index - b.index);

  return (
    <div className="gated-page-layout">
      <div className="gated-page-layout-inner">
        <div className="flex gap-2">
          { // Don't display private pages for anyone other than the list owner / collaborator
            isOwnerOrCollaborator && (
              <>
                <Link href="/" className="breadcrumb-link">
                  Lists
                </Link>
                <p className="font-semibold">/</p>
              </>
            )}
          <Link href={`/list/${list._id}`} className="breadcrumb-link">
            {list!.name}
          </Link>
          <p className="font-semibold">/</p>
          <p>{restaurant.name}</p>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold xl:text-4xl">{restaurant.name}</h1>
          <RatingDisplay rating={getAvgRating(restaurant.reviews)} />
        </div>
        <h2 className="text-2xl font-semibold xl:text-3xl">Dishes</h2>
        { // Display an error message if there are no dishes and the user is not the list owner
          (dishes.length === 0 && !isOwnerOrCollaborator) && (
            <p className="text-md md:text-lg">The owner of this list has not added any dishes.</p>
          )
        }
        <div className="cards">
          {dishes.map((dish) => (
            <DishCard key={dish._id} userId={userId} isOwnerOrCollaborator={isOwnerOrCollaborator} restaurant={restaurant} dish={dish} />
          ))}
          { // Don't display dish add card for anyone other than the list owner / collaborator
            isOwnerOrCollaborator && (
              <DishAddCard userId={userId} restaurantId={restaurant._id} />
            )
          }
        </div>
      </div>
    </div>
  );
};