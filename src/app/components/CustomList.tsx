import Link from 'next/link';
import { useListsContext } from '@/app/context/ListsContext';
import { List } from "@/app/interfaces/interfaces";
import { RatingDisplay } from "./RatingDisplay";

interface Props {
  list: List;
}

export const CustomList: React.FC<Props> = ({ list }) => {
  const { setLists } = useListsContext();

  const handleClick = (id: string) => {
    setLists((prev) => {
      const updatedLists = prev.map((l) => {
        if (l.uuid === list.uuid) {
          return {...l, restaurants: l.restaurants.map((r) => {
            if (r.id === id) {
              return {...r, visited: !r.visited};
            } else {
              return {...r};
            }
          })}
        } else {
          return {...l};
        }
      });

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
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </form>
      </div>
      <div className="flex flex-col gap-8">
        {list.restaurants.map((restaurant) => {
          return (
            <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`}>
              <div className="flex p-8 border border-gray-200 rounded-3xl cursor-pointer">
                <img className="aspect-square object-cover rounded-lg mr-8" src={restaurant.photo} alt={restaurant.name} width={200} height={200} />
                <div className="flex flex-col flex-1 gap-2">
                  <h3 className="text-2xl font-semibold">{restaurant.name}</h3>
                  <RatingDisplay rating={restaurant.rating} />
                  <p className="text-lg text-gray-600">{restaurant.address}</p>
                  <p className="text-lg text-gray-600">{restaurant.description}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                  className={`size-12 ${restaurant.visited ? 'opacity-100 text-blue-900' : 'opacity-80 text-gray-200 hover:opacity-100 hover:text-blue-900'}`}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleClick(restaurant.id); }}>
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