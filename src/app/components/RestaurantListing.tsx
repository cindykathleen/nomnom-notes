import { Restaurant } from "../interfaces/interfaces";
import { DishCard } from "./DishCard";

interface Props {
  restaurant: Restaurant;
}

export const RestaurantListing: React.FC<Props> = ({ restaurant }) => {
  return (
    <div className="relative h-screen p-16 sm:ml-64">
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-4xl font-semibold">{restaurant.name}</h1>
          <p>{restaurant.rating}</p>
          <p>{restaurant.description}</p>
        </div>
        <button className="self-start px-6 py-2 text-white font-bold bg-blue-900 rounded-lg cursor-pointer">Edit</button>
      </div>
      <div className="mb-8">
        <h2 className="text-3xl font-semibold">Dishes</h2>
      </div>
      <div className="grid grid-cols-6 gap-16 mb-4">
        {restaurant.dishes.map((dish) => {
          return <DishCard key={dish.name} dish={dish} />
        })}
        <div className="flex items-start h-full">
          <div className="flex items-center justify-center w-full aspect-square rounded-lg bg-gray-200 cursor-pointer">
            <p className="text-2xl text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};