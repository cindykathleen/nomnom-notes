'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Lists } from '@/app/interfaces/interfaces';

interface ListsContextType {
  lists: Lists;
  setLists: React.Dispatch<React.SetStateAction<Lists>>;
}

const ListsContext = createContext<ListsContextType | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export const ListsProvider: React.FC<Props> = ({ children }) => {
  const [lists, setLists] = useState<Lists>([]);

  // This is called AFTER the components mount
  // So lists is [] on initial render
  useEffect(() => {
    const fetchLists = async () => {
      const reponse = await fetch('/api/database/lists');
      const data = await reponse.json();
      setLists(data);
    }

    fetchLists()
  }, []);

  // const hasLoaded = useRef(false);

  // useEffect(() => {
  //   // Skipping the initial mount effect
  //   // Otherwise it will save an empty array to localStorage
  //   if (!hasLoaded.current) {
  //     hasLoaded.current = true;
  //     return;
  //   }

  //   localStorage.setItem("lists", JSON.stringify(lists));
  // }, [lists]);

  return (
    <ListsContext.Provider value={{ lists, setLists }}>
      {children}
    </ListsContext.Provider>
  );
}

export const useListsContext = () => {
  const context = useContext(ListsContext);
  if (!context) {
    throw new Error("useListsContext must be used within a ListsProvider");
  }
  return context;
};