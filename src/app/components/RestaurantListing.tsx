import Link from 'next/link';
import { useState, useRef } from 'react';
import { useListsContext } from '@/app/context/ListsContext';
import { Dish, Restaurant } from '@/app/interfaces/interfaces';
import { DishCard } from '@/app/components/DishCard';
import { RatingDisplay } from '@/app/components/RatingDisplay';
import { RatingSystem } from '@/app/components/RatingSystem';

interface Props {
  restaurant: Restaurant;
}

export const RestaurantListing: React.FC<Props> = ({ restaurant }) => {
  const { lists, setLists } = useListsContext();
  const [showModal, setShowModal] = useState(false);

  const currentList = lists.find((list) => list.restaurants.some((r) => r.id === restaurant.id));
  if (!currentList) return;

  // Refs/states for the input fields in the add modal
  const dishName = useRef<HTMLInputElement | null>(null);
  const dishNote = useRef<HTMLTextAreaElement | null>(null);
  const [dishImage, setDishImage] = useState<File | null>(null);
  const [dishRating, setDishRating] = useState<number>(0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDishImage(e.target.files[0]);
    }
  };

  const handleClick = async () => {
    if (dishName.current!.value === '') {
      alert("Please enter a dish name");
    } else {
      const newDish: Dish = {
        name: dishName.current!.value,
        note: dishNote.current!.value,
        rating: dishRating
      };

      // Add image only if it is provided
      if (dishImage) {
        const formData = new FormData();
        formData.append('file', dishImage);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (!response.ok) {
          console.error(`${response.status} - ${JSON.stringify(data)}`);
          return;
        }

        newDish.imageUrl = `/uploads/${dishImage.name.replaceAll(" ", "_")}`;
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
    dishNote.current!.value = '';
    setDishImage(null);
    setDishRating(0);
    setShowModal(false);
  };

  return (
    <div className="relative h-screen p-16 sm:ml-64">
      <div className="flex gap-2 mb-6">
        <Link href="/" className="font-semibold hover:underline">
          Lists
        </Link>
        <p className="font-semibold">/</p>
        <Link href={`/list/${currentList!.uuid}`} className="font-semibold hover:underline">
          {currentList!.name}
        </Link>
        <p className="font-semibold">/</p>
        <p>{restaurant.name}</p>
      </div>
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-semibold">{restaurant.name}</h1>
        <RatingDisplay rating={restaurant.rating} />
        <p>{restaurant.description}</p>
      </div>
      <div className="mb-8">
        <h2 className="text-3xl font-semibold">Dishes</h2>
      </div>
      <div className="grid grid-cols-6 gap-16 mb-4">
        {restaurant.dishes.map((dish) => {
          return <DishCard key={dish.name} list={currentList} restaurant={restaurant} dish={dish} />
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
                <RatingSystem currRating={0} setNewRating={(newRating) => { setDishRating(newRating) }} />
                <label htmlFor="dish-note" className="pb-1 mt-6 font-semibold">Note</label>
                <textarea id="dish-note" ref={dishNote} className="px-2 py-1 border border-black border-solid rounded-sm mb-6 focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)"></textarea>
                <label htmlFor="dish-image" className="pb-1 font-semibold">Image</label>
                <input id="dish-image" type="file" accept="image/*"
                  className="mb-6 file:px-4 file:py-1 file:font-semibold file:border file:border-blue-900 file:rounded-lg file:cursor-pointer"
                  onChange={handleImageChange} />
                {/* <input id="dish-image" type="text" ref={dishImage} className="px-2 py-1 border border-black border-solid rounded-sm mb-6 focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)" autoComplete="off" /> */}
                <button className="px-4 py-2 self-start text-white font-bold bg-blue-900 rounded-lg cursor-pointer" onClick={handleClick}>Add</button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};