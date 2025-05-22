'use client';

import { useEffect } from 'react';
import { useListsContext } from '@/app/context/ListsContext';
import { Search } from '@/app/components/Search';
import { Sidebar } from '@/app/components/Sidebar';

export default function SearchPage() {
  const { lists, setLists } = useListsContext();
    
    useEffect(() => {
      const storedLists = localStorage.getItem("lists");
      setLists(storedLists ? JSON.parse(storedLists) : []);
    }, []);
  
    useEffect(() => {
      localStorage.setItem("lists", JSON.stringify(lists));
    }, [lists]);

  return (
    <div>
      <Sidebar />
      <Search lists={lists} setLists={setLists} />
    </div>
  );
}