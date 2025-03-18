'use client';

import { useState, useEffect } from 'react';
import { Lists } from './interfaces/interfaces';
import { Sidebar } from './components/Sidebar';
import { CustomLists } from './components/CustomLists';

export default function HomePage() {
  const [lists, setLists] = useState<Lists>(() => {
    const storedLists = localStorage.getItem("lists");
    return storedLists ? JSON.parse(storedLists) : [];
  });

  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(lists));
  }, [lists]);

  return (
    <div>
      <Sidebar />
      <CustomLists lists={lists} setLists={setLists} />
    </div>
  );
}
