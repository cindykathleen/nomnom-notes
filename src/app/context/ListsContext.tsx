'use client';

import { createContext, useContext, useState, useEffect } from 'react';
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