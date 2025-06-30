import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { Dish, Restaurant, List } from '@/app/interfaces/interfaces';
import { DishCard } from '@/app/components/DishCard';
import { RatingDisplay } from '@/app/components/RatingDisplay';
import { RatingSystem } from '@/app/components/RatingSystem';
import { ImageInput } from '@/app/components/ImageInput';
import { uploadImage } from '@/app/lib/uploadImage';

interface Props {
  currRestaurant: Restaurant;
}

export const RestaurantListing: React.FC<Props> = ({ currRestaurant }) => {
  const [list, setList] = useState<List>();
  const [restaurant, setRestaurant] = useState<Restaurant>();
  const [dishes, setDishes] = useState<Dish[]>([]);

  // State for modal
  const [showModal, setShowModal] = useState<boolean>(false);

  // Refs/states for the input fields in the add modal
  const dishName = useRef<HTMLInputElement | null>(null);
  const dishNote = useRef<HTMLTextAreaElement | null>(null);
  const [dishImage, setDishImage] = useState<string>('');
  const [dishRating, setDishRating] = useState<number>(0);

  const fetchList = async () => {
    const response = await fetch(`/api/database/list?restaurantId=${currRestaurant._id}`)
    const data = await response.json();
    setList(data);
  }

  const fetchRestaurant = async () => {
    const response = await fetch(`/api/database/restaurants?id=${currRestaurant._id}`);
    const data = await response.json();
    setRestaurant(data);
    await fetchDishes(data.dishes);
  };

  const fetchDishes = async (dishIds: string[]) => {
    if (dishIds.length === 0) {
      setDishes([]);
      return;
    }

    const fetchedDishes = await Promise.all(
      dishIds.map(async (dishId) => {
        const response = await fetch(`/api/database/dishes/?id=${dishId}`);
        const data = await response.json();
        return data;
      })
    );

    fetchedDishes.sort((a, b) => a.index - b.index);

    setDishes(fetchedDishes);
  }

  useEffect(() => {
    fetchList();
    fetchRestaurant();
  }, []);

  const moveList = useCallback(async (dragIndex: number, hoverIndex: number) => {
    await fetch('/api/database/drag-drop', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        collectionName: 'dishes',
        dragIndex: dragIndex,
        hoverIndex: hoverIndex
      })
    })

    await fetchRestaurant();
  }, [])

  const handleAddClick = async () => {
    // Make sure restaurant is loaded before continuing
    if (!restaurant) return null

    if (dishName.current!.value === '') {
      alert("Please enter a dish name");
      return;
    }

    let dishImageID: string | null = '';

    if (dishImage !== '') {
      dishImageID = await uploadImage(dishImage);
      if (dishImageID === null) return;
    } else {
      dishImageID = '110eef21-e1df-4f07-9442-44cbca0b42fc';
    }

    let highestIndex = 0;

    if (restaurant.dishes.length > 0) {
      const response = await fetch(`/api/database/drag-drop?id=${restaurant._id}`);
      highestIndex = await response.json();
    }

    const newDish: Dish = {
      _id: uuidv4(),
      index: highestIndex + 1,
      name: dishName.current!.value,
      note: dishNote.current!.value,
      rating: dishRating,
      photoId: dishImageID,
      photoUrl: `/api/database/photos?id=${dishImageID}`
    };

    await fetch('/api/database/dishes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        restaurantId: restaurant._id,
        dish: newDish,
      })
    });

    await fetchRestaurant();

    // Reset input fields 
    dishName.current!.value = '';
    dishNote.current!.value = '';
    setDishRating(0);
    setDishImage('');
    setShowModal(false);
  };

  // Make sure list is loaded before continuing
  if (!list) return null;

  // Make sure restaurant is loaded before continuing
  if (!restaurant) return null

  return (
    <div className="relative h-screen p-16 sm:ml-64">
      <div className="flex gap-2 mb-6">
        <Link href="/" className="font-semibold hover:underline">
          Lists
        </Link>
        <p className="font-semibold">/</p>
        <Link href={`/list/${list._id}`} className="font-semibold hover:underline">
          {list!.name}
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
        {dishes.map((dish) => (
          <DishCard key={dish._id} restaurant={restaurant} dish={dish} 
            fetchRestaurant={fetchRestaurant} moveList={moveList} />
        ))}
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
      {/* Modal for adding a new dish */
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
                <RatingSystem currRating={0} setNewRating={(newRating) => setDishRating(newRating)} />
                <label htmlFor="dish-note" className="pb-1 mt-6 font-semibold">Note</label>
                <textarea id="dish-note" ref={dishNote} className="px-2 py-1 border border-black border-solid rounded-sm mb-6 focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)"></textarea>
                <ImageInput currImage={dishImage} setNewImage={(newImage) => setDishImage(newImage)} />
                <button className="px-4 py-2 self-start text-white font-bold bg-blue-900 rounded-lg cursor-pointer" onClick={handleAddClick}>Add</button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};