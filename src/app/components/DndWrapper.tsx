'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function DndWrapper({ children }: { children: React.ReactNode }) {
  return (
    // Wrap in DndProvider for drag-and-drop functionality
    <DndProvider backend={HTML5Backend}>
      {children}
    </DndProvider>
  );
}