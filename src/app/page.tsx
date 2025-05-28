'use client';

import { Sidebar } from './components/Sidebar';
import { CustomLists } from './components/CustomLists';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function HomePage() {
  return (
    // Wrap the entire application in the DndProvider for drag-and-drop functionality
    <DndProvider backend={HTML5Backend}>
      <div>
        <Sidebar />
        <CustomLists />
      </div>
    </DndProvider>
  );
}