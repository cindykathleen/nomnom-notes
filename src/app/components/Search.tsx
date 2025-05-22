import { useState, useRef } from 'react';
import { Place } from '@/app/interfaces/interfaces';
import Link from 'next/link';

export const Search = () => {
  const [results, setResults] = useState<Place[]>([]);
  const searchQuery = useRef<HTMLInputElement>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleSearch = async () => {
    const query = searchQuery.current?.value.toLowerCase();

    // Make sure the input is not null
    if (!query) return;

    // Check if the query is already stored in local storage
    const storedPlaces = JSON.parse(localStorage.getItem('places') || '{}');
    if (query in storedPlaces) {
      console.log('Using cached results');
      setResults(storedPlaces[query]);
      return;
    }

    const response = await fetch(`/api/search?query=${query}`, {
      method: 'GET'
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`HTTP ${response.status} - ${JSON.stringify(data)}`);
      return;
    }

    const places = data.places;

    setResults(places);
    localStorage.setItem('places', JSON.stringify({ ...storedPlaces, [query]: places }));
  };

  return (
    <div className="relative h-screen p-16 sm:ml-64">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold">Search</h1>
      </div>
      <div className="mb-8">
        <input id="search-query" type="text" ref={searchQuery} className="px-2 py-1 border border-black border-solid rounded-sm focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)" autoComplete="off"></input>
        <button className="px-4 py-2 self-start text-white font-bold bg-blue-900 rounded-lg cursor-pointer" onClick={handleSearch}>Search</button>
      </div>
      <div className="flex flex-col pb-8">
        {results.map((place) => {
          return (
            <div className="flex">
              <div key={place.id} className="relative min-w-2xl mb-8 bg-white cursor-pointer" onClick={() => setShowAddModal(true)}>
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
                <Link href={place.mapsUri} target="_blank">
                  <div className="group flex gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="group-hover:stroke-blue-900 size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                    <p className="text-md hover:text-blue-900">Google Maps</p>
                  </div>
                </Link>
              </div>
              {showAddModal && (
                <div className="min-w-xl px-6 py-4 border border-gray-200 rounded-lg">
                  <div className="p-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-blue-900">Add {place.name} to your list</h2>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer" onClick={() => setShowAddModal(false)}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <hr className="border-gray-300" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div >
  );
}