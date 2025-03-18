'use client';

import { Sidebar } from '@/app/components/Sidebar';
import { CustomList } from '@/app/components/CustomList';
import { List } from '@/app/interfaces/interfaces';

export default function ListPage({ id }: { id: string }) {
  const storedLists = JSON.parse(localStorage.getItem("lists")!);
  const currentList = storedLists.find((list: List) => list.uuid === id);
  
  return (
    <div>
      <Sidebar />
      <CustomList list={currentList} />
    </div>
  );
}