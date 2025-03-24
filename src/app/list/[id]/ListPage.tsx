'use client';

import { useListsContext } from '@/app/context/ListsContext';
import { Sidebar } from '@/app/components/Sidebar';
import { CustomList } from '@/app/components/CustomList';
import { List } from '@/app/interfaces/interfaces';

export default function ListPage({ id }: { id: string }) {
  const { lists } = useListsContext();
  const currentList = lists.find((list: List) => list.uuid === id);
  
  return (
    <div>
      <Sidebar />
      {currentList && <CustomList list={currentList} />}
    </div>
  );
}