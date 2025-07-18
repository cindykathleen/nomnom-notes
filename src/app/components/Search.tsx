import { useState, useEffect, useRef } from 'react';
import { Lists, Place, Restaurant } from '@/app/interfaces/interfaces';
import Link from 'next/link';

export const Search = () => {
  const [lists, setLists] = useState<Lists>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [results, setResults] = useState<Place[]>([]);

  // State for modal
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const searchQuery = useRef<HTMLInputElement>(null);

  const fetchLists = async () => {
    const reponse = await fetch('/api/database/lists');
    const data = await reponse.json();
    setLists(data);
  }

  useEffect(() => {
    fetchLists()
  }, []);

  const handleSearch = async () => {
    const query = searchQuery.current?.value.toLowerCase();

    // Make sure the input is not null
    if (!query) return;

    // Check if the query is already stored in the database
    const searchDbResponse = await fetch('/api/database/search');
    const storedPlaces = await searchDbResponse.json();

    if (storedPlaces.some((place: Place) => place._id === query)) {
      setResults(storedPlaces.find((place: Place) => place._id === query)?.result || []);
      return;
    }

    const searchResponse = await fetch(`/api/search?query=${query}`);
    const data = await searchResponse.json();
    const places = data.places;

    await fetch('/api/database/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query, places })
    });

    setResults(places);
  };

  const handleAddToList = async (id: string, place: Place) => {
    // Check if the restaurant is already in the list
    const currentList = lists.find((list) => list._id === id);
    if (currentList!.restaurants.find((restaurant) => restaurant === place._id)) {
      alert("This restaurant is already in the list");
      return;
    }

    // Get the restaurant cover photo from Google
    if (place.photoId !== '') {
      const response = await fetch(`/api/google-photos/?photoId=${place.photoId}`);
      const data = await response.json();
      place.photoId = data.photoId;
    } else {
      // Use a placeholder image if no photo is available from Google
      // There is a placeholder image in the database
      place.photoId = '110eef21-e1df-4f07-9442-44cbca0b42fc';
    }

    const newRestaurant: Restaurant = {
      _id: place._id,
      name: place.name,
      type: place.type,
      address: place.address,
      location: place.location,
      mapsUrl: place.mapsUrl,
      photoId: place.photoId,
      photoUrl: `/api/database/photos?id=${place.photoId}`,
      rating: 0,
      description: '',
      dishes: [],
      dateAdded: new Date()
    }

    await fetch('/api/database/restaurants/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        listId: id,
        restaurant: newRestaurant
      })
    });

    setShowConfirmation(true);
  };

  return (
    <div className="relative h-screen p-16 sm:ml-64">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold">Search</h1>
      </div>
      <div className="flex gap-4 mb-8">
        <input id="search-query" type="text" ref={searchQuery} className="min-w-md px-2 py-1 border border-black border-solid rounded-sm focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)" autoComplete="off"></input>
        <button className="px-4 py-2 self-start text-white font-bold bg-blue-900 rounded-lg cursor-pointer" onClick={handleSearch}>Search</button>
      </div>
      <div className="flex pb-8">
        <div className="flex flex-col min-w-3xl">
          {results.map((place) => {
            return (
              <div key={place._id} className="relative mb-8 bg-white cursor-pointer" onClick={() => { fetchLists(); setSelectedPlace(place); }}>
                <p className="text-xl font-semibold pb-2">{place.name}</p>
                <div className="flex gap-2 pb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                  </svg>
                  <p className="text-md">{place.type}</p>
                </div>
                <div className="flex gap-2 pb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <p className="text-md">{place.address}</p>
                </div>
                <Link href={place.mapsUrl} target="_blank">
                  <div className="group flex gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="group-hover:stroke-blue-900 size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                    <p className="text-md hover:text-blue-900">Google Maps</p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
        {selectedPlace && (
          <div className="min-w-xl h-full px-6 py-4 border border-gray-200 rounded-lg">
            <div className="p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-blue-900">Add {selectedPlace.name} to your list</h2>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer" onClick={() => setSelectedPlace(null)}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </div>
            <hr className="border-gray-300" />
            <div className="p-4 flex flex-col">
              <p className="pb-4 text-lg font-bold">Select a list</p>
              <div className="flex flex-col gap-4">
                {lists.map((list) => {
                  return (
                    <div key={list._id} className="flex gap-4 cursor-pointer" onClick={() => handleAddToList(list._id, selectedPlace)}>
                      <img className="max-w-24 aspect-square rounded-lg mb-4" src={list.photoUrl} alt={list.name} />
                      <div>
                        <p className="font-semibold">{list.name}</p>
                        <p>{list.restaurants.length} places</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        { // Confirmation that the restaurant has been added to a list
          showConfirmation && (
            <div className="absolute flex items-center justify-center inset-0 w-full h-full bg-(--modal-background)">
              <div role="alert" className="relative px-6 py-8 w-1/5 border border-gray-300 rounded-lg bg-gray-50">
                <h3 className="mb-4 text-2xl font-semibold text-blue-900">The restaurant has been added to the list</h3>
                <button type="button"
                  className="px-8 py-1.5 text-sm text-blue-900 text-center bg-transparent border border-blue-900 focus:ring-2 focus:outline-none focus:ring-gray-300 rounded-lg cursor-pointer"
                  onClick={() => {setShowConfirmation(false); setSelectedPlace(null);}}>
                  Ok
                </button>
              </div>
            </div>
          )
        }
      </div>
    </div >
  );
}