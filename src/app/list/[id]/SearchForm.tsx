'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function SearchForm({
  query,
  onClose,
}: {
  query?: string;
  onClose?: () => void;
}) {
  const [inputValue, setInputValue] = useState(query || '');

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const searchQuery = formData.get('search-query') as string || '';
    const params = new URLSearchParams(searchParams.toString());
    params.set('query', searchQuery);
    const newQueryString = params.toString() ? `?${params.toString()}` : '';
    router.replace(`${pathname}${newQueryString}`);
  }

  return (
    <div className="flex items-center gap-2">
      <form onSubmit={handleSubmit} data-cy="restaurant-search"
        className="p-1 flex flex-1 items-center gap-4 bg-snowwhite border border-lightgray rounded-3xl">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="hidden md:block md:ml-4 md:size-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input id="search-query" name="search-query" type="text" className="p-1 pl-4 w-full md:pl-1 focus:outline-none" autoComplete="off"
          value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <button type="submit" className="button-primary flex justify-center rounded-3xl">
          {/* Show the search icon on mobile */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="block size-6 md:hidden">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          {/* Show the text on tablet/desktop */}
          <span className="hidden md:block">Search</span>
        </button>
      </form>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          data-cy="restaurant-search-close"
          aria-label="Close search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="modal-close">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
