'use client';

import { useListsContext } from './context/ListsContext';
import { Sidebar } from './components/Sidebar';
import { CustomLists } from './components/CustomLists';

export default function HomePage() {
  const { lists, setLists } = useListsContext();

  return (
    <div>
      <Sidebar />
      <CustomLists lists={lists} setLists={setLists} />
    </div>
  );
}