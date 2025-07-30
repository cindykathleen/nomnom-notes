'use client';

import { useState, useEffect } from 'react';
import { Nav } from '@/app/components/Nav';
import { CustomList } from '@/app/components/CustomList';
import { List } from '@/app/interfaces/interfaces';

export default function ListPage({ id }: { id: string }) {
  const [list, setList] = useState<List>();

  useEffect(() => {
    const fetchList = async () => {
      const response = await fetch(`/api/database/list?id=${id}`);
      const data = await response.json();
      setList(data);
    }

    fetchList();
  }, []);

  return (
    <div>
      <Nav />
      {list && <CustomList currList={list} />}
    </div>
  );
}