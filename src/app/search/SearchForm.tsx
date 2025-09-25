'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function SearchForm({ query }: { query?: string }) {
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
    <form onSubmit={handleSubmit}
      className="p-2 flex items-center gap-4 bg-snowwhite border border-lightgray rounded-3xl">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-4 size-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
      <input id="search-query" name="search-query" type="text"
        value={inputValue} onChange={(e) => setInputValue(e.target.value)}
        className="p-1 w-full focus:outline-none" autoComplete="off" />
      <button type="submit"
        className="px-8 py-2 self-start text-snowwhite font-bold bg-darkpink rounded-3xl cursor-pointer 
            hover:bg-mauve transition-colors">
        Search
      </button>
    </form>
  );
}
