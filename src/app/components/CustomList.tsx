import Link  from 'next/link';
import { useListsContext } from '../context/ListsContext';
import { List, Restaurant } from "../interfaces/interfaces";
import { RatingDisplay } from "./RatingDisplay";

interface Props {
  list: List;
}

export const CustomList: React.FC<Props> = ({ list }) => {
  const { setLists } = useListsContext();

  const handleClick = (restaurant: Restaurant) => {
    restaurant.visited = !restaurant.visited;

    setLists((prev) => {
      const updatedLists = [...prev];
      updatedLists.find((l) => l.uuid === list.uuid)!.restaurants.find((r) => r.id === restaurant.id)!.visited = !restaurant.visited;
      return updatedLists;
    });
  };

  return (
    <div className="relative h-screen p-16 sm:ml-64">
      <div className="flex justify-between mb-8">
        <h1 className="text-4xl font-semibold">{list.name}</h1>
        <button className="self-start px-6 py-2 text-white font-bold bg-blue-900 rounded-lg cursor-pointer">Edit</button>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">{`${list.restaurants.length} Places`}</h2>
        <form className="flex items-center w-64 my-2">
          <p className="text-lg text-nowrap mr-2">Sort by</p>
          <select className="w-full bg-transparent text-lg font-semibold appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 peer">
            <option defaultValue="date-added">Date added</option>
            <option value="recently-added">Recently added</option>
            <option value="name">Name</option>
          </select>
        </form>
      </div>
      <div className="flex flex-col gap-8">
        {list.restaurants.map((restaurant) => {
          return (
            <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`}>
              <div className="flex p-8 border border-gray-200 rounded-3xl cursor-pointer">
                <img className="rounded-lg mr-8" src={restaurant.imageUrl} alt={restaurant.name} width={200} height={200} />
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold">{restaurant.name}</h3>
                  <RatingDisplay rating={restaurant.rating} />
                  <p className="text-lg text-gray-600">{restaurant.location}</p>
                  <p className="text-lg text-gray-600">{restaurant.description}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                  className={`size-12 ${restaurant.visited ? 'opacity-100 text-blue-900' : 'opacity-80 text-gray-200 hover:opacity-100 hover:text-blue-900'}`}
                  onClick={(e) => {e.preventDefault(); e.stopPropagation(); handleClick(restaurant);}}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};