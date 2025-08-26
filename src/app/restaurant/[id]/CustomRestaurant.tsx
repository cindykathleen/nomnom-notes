import { db } from '@/app/lib/database';
import { Dish } from '@/app/interfaces/interfaces';
import Link from 'next/link';
import RatingDisplay from '@/app/components/RatingDisplay';
import DishCard from './DishCard';
import DishAddCard from './DishAddCard';

export default async function CustomRestaurant({ userId, restaurantId }: { userId: string, restaurantId: string }) {
  let list;

  try {
    list = await db.getListByRestaurantId(userId, restaurantId);

    if (!list) {
      return <div>Error fetching list</div>;
    }
  } catch (err) {
    return <div>Error fetching list</div>;
  }

  let restaurant;

  try {
    restaurant = await db.getRestaurant(restaurantId);

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
        const dish = await db.getDish(dishId);

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
    <div className="relative h-full w-screen p-16 mt-[80px] flex justify-center">
      <div className="max-w-[1440px] w-full px-8 flex flex-col space-y-6">
        <div className="flex gap-2">
          <Link href="/lists/" className="font-semibold hover:text-mauve transition-colors">
            Lists
          </Link>
          <p className="font-semibold">/</p>
          <Link href={`/list/${list._id}`} className="font-semibold hover:text-mauve transition-colors">
            {list!.name}
          </Link>
          <p className="font-semibold">/</p>
          <p>{restaurant.name}</p>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-semibold">{restaurant.name}</h1>
          <RatingDisplay rating={restaurant.rating} />
          <p className="whitespace-pre-line">{restaurant.description}</p>
        </div>
        <div className="">
          <h2 className="text-3xl font-semibold">Dishes</h2>
        </div>
        <div className="grid grid-cols-4 gap-16">
          {dishes.map((dish) => (
            <DishCard key={dish._id} restaurant={restaurant} dish={dish} />
          ))}
          <DishAddCard restaurantId={restaurant._id} />
        </div>
      </div>
    </div>
  );
};