'use client';

import { useEffect } from 'react';
import { useListsContext } from './context/ListsContext';
import { Sidebar } from './components/Sidebar';
import { CustomLists } from './components/CustomLists';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function HomePage() {
  const { lists, setLists } = useListsContext();
  
  useEffect(() => {
    const storedLists = localStorage.getItem("lists");
    setLists(storedLists ? JSON.parse(storedLists) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(lists));
  }, [lists]);

  return (
    // Wrap the entire application in the DndProvider for drag-and-drop functionality
    <DndProvider backend={HTML5Backend}>
      <div>
        <Sidebar />
        <CustomLists lists={lists} setLists={setLists} />
      </div>
    </DndProvider>
  );
}