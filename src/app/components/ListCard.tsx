import { useState, useRef } from 'react';
import Link from 'next/link';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';
import { List } from "@/app/interfaces/interfaces";

interface Props {
  list: List;
  setSelectedList: React.Dispatch<React.SetStateAction<List | null>>;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowDeleteAlert: React.Dispatch<React.SetStateAction<boolean>>;
  setInputName: React.Dispatch<React.SetStateAction<string>>;
  setInputDescription: React.Dispatch<React.SetStateAction<string>>;
  setInputImage: React.Dispatch<React.SetStateAction<string>>;
  moveList: (dragIndex: number, hoverIndex: number) => void; // Function used to reorder the lists
}

interface DragItem {
  index: number;
}

export const ListCard: React.FC<Props> = ({ list, setSelectedList, setShowEditModal, setShowDeleteAlert, setInputName, setInputDescription, setInputImage, moveList }) => {
  // State for modal
  const [showMenuModal, setShowMenuModal] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: "list",
    // A collecting function that keeps track of the drop target/zone
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      }
    },
    hover(item: DragItem, monitor) {
      // Checking to make sure ref is not null
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = list.index;

      // Don't call moveList if the item is hovering over itself
      if (dragIndex === hoverIndex) {
        return;
      }

      // Get the bounding rect of the hovered item
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get the middle of the hovered item
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      // Get the mouse position
      const clientOffset = monitor.getClientOffset();
      // Get the pixels to the left
      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left;

      // Don't call moveList if the item did not pass the middle while dragging to the right
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }
      // Don't call moveList if the item did not pass the middle while dragging to the left
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }

      moveList(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  })

  const [{ isDragging }, drag] = useDrag({
    type: "list",
    item: () => {
      return { id: list._id, index: list.index }
    },
    // A collecting function that keeps track of the dragging state
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging()
    }),
  })

  // Setting ref to act as both a drag source and a drop target
  drag(drop(ref));

  return (
    <div ref={ref} key={list._id} className="flex flex-col relative bg-white rounded-sm" data-handler-id={handlerId}>
      <Link href={`/list/${list._id}`}><img className="aspect-square rounded-lg mb-4" src={list.photoUrl} alt={list.name} /></Link>
      <div className="flex justify-between relative">
        <p className="text-2xl font-semibold">{list.name}</p>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
          className="size-9 cursor-pointer"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenuModal(!showMenuModal); }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
        {/* Modal for menu */
          showMenuModal && (
            <div className="flex flex-col absolute right-0 top-8 min-w-30 p-2 bg-white border border-gray-200 rounded-sm">
              <button
                className="px-2 py-1 mb-2 text-left cursor-pointer hover:bg-gray-100"
                onClick={(e) => { setShowMenuModal(false); setSelectedList(list); setShowEditModal(true); setInputName(list.name); setInputDescription(list.description); setInputImage(list.photoUrl); }}>
                Edit
              </button>
              <button
                className="px-2 py-1 text-left cursor-pointer hover:bg-gray-100"
                onClick={(e) => { setShowMenuModal(false); setSelectedList(list); setShowDeleteAlert(true); }}>
                Delete
              </button>
            </div>
          )
        }
      </div>
      <p className="py-1 text-lg/6 whitespace-pre-line">{list.description}</p>
    </div>
  );
}