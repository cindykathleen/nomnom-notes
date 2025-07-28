'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Sidebar } from './Sidebar';
import { CustomLists } from './CustomLists';

export const DndWrapper = () => {
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