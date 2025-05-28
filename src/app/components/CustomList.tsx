import Link from 'next/link';
import { useState } from 'react';
import { useListsContext } from '@/app/context/ListsContext';
import { List, Restaurant } from '@/app/interfaces/interfaces';
import { RatingDisplay } from '@/app/components/RatingDisplay';
import { RatingSystem } from '@/app/components/RatingSystem';

interface Props {
  list: List;
}

export const CustomList: React.FC<Props> = ({ list }) => {
  const { setLists } = useListsContext();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [ratingHover, setRatingHover] = useState<boolean>(false);
  const [inputDescription, setInputDescription] = useState<string>('');

  const handleEditClick = (id: string) => {
    // Updating the restaurant description
    setLists((prev) => {
      const updatedLists = [...prev];
      const listIndex = updatedLists.findIndex((l) => l.uuid === list.uuid);
      const restaurantIndex = updatedLists[listIndex].restaurants.findIndex((restaurant) => restaurant.id === id);
      updatedLists[listIndex].restaurants[restaurantIndex].description = inputDescription;
      return updatedLists;
    });

    setSelectedRestaurant(null);
  };

  return (
    <div className="relative h-screen p-16 sm:ml-64">
      <div className="flex justify-between mb-8">
        <h1 className="text-4xl font-semibold">{list.name}</h1>
        <button className="self-start px-6 py-2 text-white font-bold bg-blue-900 rounded-lg cursor-pointer">Edit</button>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">{`${list.restaurants.length} Places`}</h2>
        {/* TODO: Implement sorting functionality
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
        </form> */}
      </div>
      <div className="flex flex-col gap-8 pb-16">
        {list.restaurants.map((restaurant) => {
          return (
            <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`}>
              <div className="flex p-8 border border-gray-200 rounded-3xl cursor-pointer">
                <img className="aspect-square object-cover rounded-lg mr-8" src={restaurant.photo} alt={restaurant.name} width={200} height={200} />
                <div className="flex flex-col flex-1 gap-2">
                  <h3 className="text-2xl font-semibold">{restaurant.name}</h3>
                  <RatingDisplay rating={restaurant.rating} />
                  <p className="text-lg text-gray-600">{restaurant.description}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                  className="size-10 text-gray-400 hover:bg-gray-400 hover:text-white rounded-full transition-colors duration-100"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedRestaurant(restaurant); setInputDescription(restaurant.description); }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
      {/* Modal for editing restaurants */
        selectedRestaurant && (
          <div className="absolute flex items-center justify-center inset-0 w-full h-full bg-(--modal-background)">
            <div className="relative px-6 py-8 w-2/5 bg-white rounded-lg">
              <div className="p-4 flex items-center justify-between">
                <h2 className="text-3xl font-semibold text-blue-900">Edit {selectedRestaurant.name}</h2>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 cursor-pointer" onClick={() => setSelectedRestaurant(null)}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <hr className="border-gray-300" />
              <div className="p-4 flex flex-col">
                <label className="pb-1 font-semibold">Rating</label>
                <div className="w-fit mb-6" onMouseEnter={() => setRatingHover(true)} onMouseLeave={() => setRatingHover(false)}>
                  { ratingHover 
                    ? <RatingSystem list={list} restaurant={selectedRestaurant} rating={selectedRestaurant.rating} /> 
                    : <RatingDisplay rating={selectedRestaurant.rating} /> }
                </div>
                <label className="pb-1 font-semibold">Description</label>
                <textarea placeholder="Add a description for this restaurant" value={inputDescription} onChange={(e) => setInputDescription(e.target.value)}
                  className="px-2 py-1 border border-black border-solid rounded-sm mb-6 focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)"></textarea>
                <button className="px-4 py-2 self-start text-white font-bold bg-blue-900 rounded-lg cursor-pointer" onClick={() => handleEditClick(selectedRestaurant.id)}>Update</button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};