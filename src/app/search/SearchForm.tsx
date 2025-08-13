'use client';

import { useState } from 'react';
import { Lists, Place } from '@/app/interfaces/interfaces';
import { searchQuery } from '@/app/actions/search';
import SearchResults from './SearchResults';

export default function SearchForm({ lists }: { lists: Lists }) {
  const [results, setResults] = useState<Place[]>([]);

  return (
    <div>
      <form action={async (formData) => {
        setResults(await searchQuery(formData));
      }} className="mb-8 flex gap-4">
        <input id="search-query" name="search-query" type="text"
          className="min-w-md px-2 py-1 border border-charcoal rounded-sm focus:outline-none focus:border-darkpink focus:shadow-(--input-shadow)" autoComplete="off" />
        <button type="submit" className="px-4 py-2 self-start text-snowwhite font-bold bg-darkpink rounded-lg cursor-pointer hover:bg-mauve transition-colors">Search</button>
      </form>
      <SearchResults lists={lists} places={results} />
    </div>
  );
}
