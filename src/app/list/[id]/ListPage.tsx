'use client';

import { useListsContext } from '@/app/context/ListsContext';
import { Sidebar } from '@/app/components/Sidebar';
import { CustomList } from '@/app/components/CustomList';
import { List } from '@/app/interfaces/interfaces';

export default function ListPage({ id }: { id: string }) {
  const { lists } = useListsContext();
  
  const list = lists.find((l: List) => l.uuid === id);
  
  return (
    <div>
      <Sidebar />
      {list && <CustomList list={list} />}
    </div>
  );
}