'use client';

import { Search } from '@/app/components/Search';
import { Sidebar } from '@/app/components/Sidebar';

export default function SearchPage() {
  return (
    <div>
      <Sidebar />
      <Search />
    </div>
  );
}