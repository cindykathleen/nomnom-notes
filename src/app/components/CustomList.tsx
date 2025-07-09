import Link from 'next/link';
import { useState, useEffect } from 'react';
import { List, Restaurant } from '@/app/interfaces/interfaces';
import { RatingDisplay } from '@/app/components/RatingDisplay';
import { RatingSystem } from '@/app/components/RatingSystem';

interface Props {
  currList: List;
}

enum SortType {
  RecentlyAdded = 'recently-added',
  Name = 'name'
}

export const CustomList: React.FC<Props> = ({ currList }) => {
  const [list, setList] = useState<List>();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [sort, setSort] = useState<SortType>(SortType.RecentlyAdded);

  // States for modals & alerts
  const [selectedMenuModal, setSelectedMenuModal] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);

  // States for the input fields in the edit modal
  const [rating, setRating] = useState<number>(0);
  const [ratingHover, setRatingHover] = useState<boolean>(false);
  const [inputDescription, setInputDescription] = useState<string>('');

  const fetchList = async () => {
    const response = await fetch(`/api/database/list?id=${currList._id}`);
    const data = await response.json();
    setList(data);
    await fetchRestaurants(data.restaurants, sort);
  }

  const fetchRestaurants = async (restaurantIds: string[], sort: SortType) => {
    if (restaurantIds.length === 0) return;

    const fetchedRestaurants = await Promise.all(
      restaurantIds.map(async (restaurantId) => {
        const response = await fetch(`/api/database/restaurants?id=${restaurantId}`);
        const data = await response.json();
        return data;
      })
    );

    if (sort === SortType.RecentlyAdded) {
      fetchedRestaurants.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
    } else if (sort === SortType.Name) {
      fetchedRestaurants.sort((a, b) => a.name.localeCompare(b.name));
    }

    setRestaurants(fetchedRestaurants);
  }

  useEffect(() => {
    fetchList();
  }, [sort]);

  const handleEditClick = async (id: string) => {
    const updatedRestaurant: Partial<Restaurant> = {
      _id: id,
      rating: rating,
      description: inputDescription,
    }

    await fetch('/api/database/restaurants', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        restaurant: updatedRestaurant
      })
    })

    setSelectedRestaurant(null);
    setShowEditModal(false);

    await fetchList();
  };

  const handleDeleteClick = async (id: string) => {
    // Make sure list is loaded before continuing
    if (!list) return null

    await fetch('/api/database/restaurants', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        listId: list._id,
        restaurantId: id
      })
    })

    setSelectedRestaurant(null);
    setShowDeleteAlert(false);

    await fetchList();
  }

  // Make sure list is loaded before continuing
  if (!list) return null;

  return (
    <div className="relative h-screen p-16 sm:ml-64">
      <div className="flex gap-2 mb-6">
        <Link href="/" className="font-semibold hover:underline">
          Lists
        </Link>
        <p className="font-semibold">/</p>
        <p>{list.name}</p>
      </div>
      <h1 className="mb-8 text-4xl font-semibold">{list.name}</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">{`${list.restaurants.length} Places`}</h2>
        <form className="flex items-center w-fit my-2">
          <p className="text-lg text-nowrap mr-2">Sort by</p>
          <select className="w-full bg-transparent text-lg font-semibold appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 peer"
            onChange={(e) => setSort(e.target.value as SortType)}>
            <option value={SortType.RecentlyAdded}>Recently added</option>
            <option value={SortType.Name}>Name</option>
          </select>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </form>
      </div>
      <div className="flex gap-8">
        <div className="flex flex-col gap-8 pb-16 w-1/2">
          {restaurants.map((restaurant: Restaurant) => {
            return (
              <Link key={restaurant._id} href={`/restaurant/${restaurant._id}`}>
                <div className="flex relative p-8 border border-gray-200 rounded-3xl cursor-pointer">
                  <img className="aspect-square object-cover rounded-lg mr-8" src={restaurant.photoUrl} alt={restaurant.name} width={200} height={200} />
                  <div className="flex flex-col flex-1 gap-2">
                    <h3 className="text-2xl font-semibold">{restaurant.name}</h3>
                    <RatingDisplay rating={restaurant.rating} />
                    <p className="text-lg text-gray-700 whitespace-pre-line">{restaurant.description}</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                    className="size-10 cursor-pointer"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedMenuModal(selectedMenuModal === restaurant._id ? null : restaurant._id); }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                  {/* Modal for menu */
                    selectedMenuModal === restaurant._id && (
                      <div className="flex flex-col absolute right-9 top-18 min-w-30 p-2 bg-white border border-gray-200 rounded-sm">
                        <button
                          className="px-2 py-1 mb-2 text-left cursor-pointer hover:bg-gray-100"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedMenuModal(null); setSelectedRestaurant(restaurant); setShowEditModal(true); setInputDescription(restaurant.description); setRating(restaurant.rating); }}>
                          Edit
                        </button>
                        <button
                          className="px-2 py-1 text-left cursor-pointer hover:bg-gray-100"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedMenuModal(null); setSelectedRestaurant(restaurant); setShowDeleteAlert(true); }}>
                          Delete
                        </button>
                      </div>
                    )
                  }
                </div>
              </Link>
            );
          })}
        </div>
        <div className="w-1/2">
          
        </div>
      </div>
      { // Modal for editing restaurants
        showEditModal && selectedRestaurant && (
          <div className="fixed flex items-center justify-center inset-0 w-full h-full bg-(--modal-background)">
            <div className="relative px-6 py-8 w-2/5 bg-white rounded-lg">
              <div className="p-4 flex items-center justify-between">
                <h2 className="text-3xl font-semibold text-blue-900">Edit {selectedRestaurant.name}</h2>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 cursor-pointer" onClick={() => { setSelectedRestaurant(null); setShowEditModal(false); }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <hr className="border-gray-300" />
              <div className="p-4 flex flex-col">
                <label htmlFor="restaurant-rating" className="pb-1 font-semibold">Rating</label>
                <div id="restaurant-rating" className="w-fit mb-6" onMouseEnter={() => setRatingHover(true)} onMouseLeave={() => setRatingHover(false)}>
                  {ratingHover
                    ? <RatingSystem currRating={rating} setNewRating={newRating => setRating(newRating)} />
                    : <RatingDisplay rating={rating} />
                  }
                </div>
                <label htmlFor="restaurant-description" className="pb-1 font-semibold">Description</label>
                <textarea id="restaurant-description" placeholder="Add a description for this restaurant" value={inputDescription} onChange={(e) => setInputDescription(e.target.value)}
                  className="px-2 py-1 border border-black border-solid rounded-sm mb-6 focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)"></textarea>
                <button className="px-4 py-2 self-start text-white font-bold bg-blue-900 rounded-lg cursor-pointer" onClick={() => handleEditClick(selectedRestaurant._id)}>Update</button>
              </div>
            </div>
          </div>
        )
      }
      { // Alert for deleting a restaurant
        showDeleteAlert && selectedRestaurant && (
          <div className="fixed flex items-center justify-center inset-0 w-full h-full bg-(--modal-background)">
            <div role="alert" className="relative px-6 py-8 w-1/5 border border-gray-300 rounded-lg bg-gray-50">
              <h3 className="mb-4 text-2xl font-semibold text-blue-900">Are you sure you want to delete this dish?</h3>
              <div className="flex">
                <button type="button"
                  className="px-8 py-1.5 mr-4 text-sm text-white text-center bg-blue-900 focus:ring-2 focus:outline-none focus:ring-gray-300 rounded-lg cursor-pointer"
                  onClick={() => { handleDeleteClick(selectedRestaurant._id) }}>
                  Yes
                </button>
                <button type="button"
                  className="px-8 py-1.5 text-sm text-blue-900 text-center bg-transparent border border-blue-900 focus:ring-2 focus:outline-none focus:ring-gray-300 rounded-lg cursor-pointer"
                  onClick={() => { setSelectedRestaurant(null); setShowDeleteAlert(false); }}>
                  No
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};