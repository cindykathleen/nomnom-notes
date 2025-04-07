import { useState, useRef } from 'react';
import { useListsContext } from '../context/ListsContext';
import { Dish, Restaurant } from "../interfaces/interfaces";
import { DishCard } from "./DishCard";
import { RatingDisplay } from "./RatingDisplay";

interface Props {
  restaurant: Restaurant;
}

export const RestaurantListing: React.FC<Props> = ({ restaurant }) => {
  const { setLists } = useListsContext();
  const [showModal, setShowModal] = useState(false);

  const dishName = useRef<HTMLInputElement | null>(null);
  const dishRating = useRef<HTMLInputElement | null>(null);
  const dishNote = useRef<HTMLInputElement | null>(null);
  const dishImage = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    if (dishName.current!.value === '') {
      alert("Please enter a dish name");
    } else if (Number(dishRating.current!.value) < 0.5 || Number(dishRating.current!.value) > 5) {
      alert("Please enter a rating between 0.5 and 5");
    } else {
      const newDish: Dish = {
        name: dishName.current!.value,
        note: dishNote.current!.value,
        rating: Number(dishRating.current!.value)
      };
  
      // Add image only if it is provided
      if (dishImage.current!.value !== '') {
        newDish.imageUrl = dishImage.current!.value;
      }
  
      setLists((prev) => {
        return prev.map((list) => {
          const updatedRestaurants = list.restaurants.map((r) => {
            if (r.id === restaurant.id) {
              return {
                ...r,
                dishes: [...r.dishes, newDish],
              };
            }
            return r;
          });
  
          return {
            ...list,
            restaurants: updatedRestaurants,
          };
        });
      });
    }

    // Reset input fields 
    dishName.current!.value = '';
    dishRating.current!.value = '';
    dishNote.current!.value = '';
    dishImage.current!.value = '';
    setShowModal(false);
  };

  return (
    <div className="relative h-screen p-16 sm:ml-64">
      <div className="flex justify-between mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-semibold">{restaurant.name}</h1>
          <RatingDisplay rating={restaurant.rating} />
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
          <div className="flex items-center justify-center w-full aspect-square rounded-lg bg-gray-200 cursor-pointer" onClick={() => setShowModal(true)}>
            <p className="text-2xl text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </p>
          </div>
        </div>
      </div>
      {/* Modal for creating a new dish */
        showModal && (
          <div className="absolute flex items-center justify-center inset-0 w-full h-full bg-(--modal-background)">
            <div className="relative px-6 py-8 w-2/5 bg-white rounded-lg">
              <div className="p-4 flex items-center justify-between">
                <h2 className="text-3xl font-semibold text-blue-900">Add a dish</h2>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 cursor-pointer" onClick={() => setShowModal(false)}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <hr className="border-gray-300" />
              <div className="p-4 flex flex-col">
                <label htmlFor="dish-name" className="pb-1 font-semibold">Name</label>
                <input id="dish-name" type="text" ref={dishName} className="px-2 py-1 border border-black border-solid rounded-sm mb-6 focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)" autoComplete="off" />
                <label htmlFor="dish-name" className="pb-1 font-semibold">Rating</label>
                <input id="dish-name" type="text" ref={dishRating} className="px-2 py-1 border border-black border-solid rounded-sm mb-6 focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)" autoComplete="off" />
                <label htmlFor="dish-note" className="pb-1 font-semibold">Note</label>
                <input id="dish-note" type="text" ref={dishNote} className="px-2 py-1 border border-black border-solid rounded-sm mb-6 focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)" autoComplete="off" />
                <label htmlFor="dish-image" className="pb-1 font-semibold">Image</label>
                <input id="dish-image" type="text" ref={dishImage} className="px-2 py-1 border border-black border-solid rounded-sm mb-6 focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)" autoComplete="off" />
                <button className="px-4 py-2 self-start text-white font-bold bg-blue-900 rounded-lg cursor-pointer" onClick={handleClick}>Add</button>
              </div>
            </div>
          </div>
        )
      } 
    </div>
  );
};