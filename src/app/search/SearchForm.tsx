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
    <form onSubmit={handleSubmit} className="flex gap-4">
      <input id="search-query" name="search-query" type="text"
        value={inputValue} onChange={(e) => setInputValue(e.target.value)}
        className="w-full px-2 py-1 bg-snowwhite border border-charcoal rounded-sm 
            focus:outline-none focus:border-darkpink focus:shadow-(--input-shadow)"
        autoComplete="off" />
      <button type="submit"
        className="px-4 py-2 self-start text-snowwhite font-bold bg-darkpink rounded-lg cursor-pointer 
            hover:bg-mauve transition-colors">
        Search
      </button>
    </form>
  );
}
