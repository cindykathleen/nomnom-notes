import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';
import { List, Lists } from "@/app/interfaces/interfaces";

interface ListProps {
  list: List;
  index: number;
  // function used to reorder the lists
  moveList: (dragIndex: number, hoverIndex: number) => void;
  setShowImageModal: React.Dispatch<React.SetStateAction<boolean>>;
  setLists: React.Dispatch<React.SetStateAction<Lists>>;
}
interface CustomListsProps {
  lists: Lists;
  setLists: React.Dispatch<React.SetStateAction<Lists>>;
}

interface DragItem {
  index: number;
}

const ListComponent: React.FC<ListProps> = ({ list, index, moveList, setShowImageModal, setLists }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: "list",
    // a collecting function that keeps track of the drop target/zone
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      }
    },
    hover(item: DragItem, monitor) {
      // checking to make sure ref is not null
      if (!ref.current) {
        return;
      }
      
      const dragIndex = item.index;
      const hoverIndex = index;

      // don't call moveList if the item is hovering over itself
      if (dragIndex === hoverIndex) {
        return;
      }

      // get the bounding rect of the hovered item
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // get the middle of the hovered item
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      // get the mouse position
      const clientOffset = monitor.getClientOffset();
      // get the pixels to the left
      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left;

      // don't call moveList if the item did not pass the middle while dragging to the right
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }
      // don't call moveList if the item did not pass the middle while dragging to the left
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
      return { id: list.uuid, index }
    },
    // a collecting function that keeps track of the dragging state
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging()
    }),
  })

  // setting ref to act as both a drag source and a drop target
  drag(drop(ref));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, key: string) => {
    const cleanText = e.target.value;

    setLists((prev) => {
      const updatedLists = [...prev];

      if (key === "name") {
        updatedLists[index].name = cleanText;
      } else if (key === "description") {
        updatedLists[index].description = cleanText;
      }

      return updatedLists;
    });
  };

  return (
    <div ref={ref} key={list.uuid} className="flex flex-col relative bg-white rounded-sm" data-handler-id={handlerId}>
      <Link href={`/list/${list.uuid}`}>
        <div className="group">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="hidden group-hover:block absolute top-2 right-2 size-9 z-99" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowImageModal(true); }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
          <img className="aspect-square rounded-lg mb-4" src={list.imageUrl} alt={list.name} />
        </div>
      </Link>
      <input className="text-2xl font-semibold px-2 py-1 border border-transparent border-solid rounded-sm focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)" value={list.name} onChange={(e) => handleChange(e, index, "name")}></input>
      <textarea className="text-lg/6 resize-none px-2 py-1 border border-transparent border-solid rounded-sm focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)" value={list.description} onChange={(e) => handleChange(e, index, "description")}></textarea>
    </div>
  );
}

export const CustomLists: React.FC<CustomListsProps> = ({ lists, setLists }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const listName = useRef<HTMLInputElement | null>(null);
  const listDescription = useRef<HTMLInputElement | null>(null);
  const listImage = useRef<HTMLInputElement | null>(null);

  const moveList = useCallback((dragIndex: number, hoverIndex: number) => {
    setLists((prev) => {
      const updatedLists = [...prev];
      const dragCard = updatedLists[dragIndex];

      updatedLists.splice(dragIndex, 1);
      updatedLists.splice(hoverIndex, 0, dragCard);

      return updatedLists;
    })
  }, [])

  const renderList = useCallback(
    (list: List, index: number) => {
      return (
        <ListComponent key={list.uuid} list={list} index={index} moveList={moveList} setShowImageModal={setShowImageModal} setLists={setLists} />
      )
    },
    [],
  )
  
  const handleAddClick = () => {
    if (listName.current!.value === '') {
      alert("Please enter a list name");
      return;
    }
    
    // Use a placeholder image if no image is provided
    listImage.current!.value === '' ? listImage.current!.value = 'https://placehold.co/400' : listImage.current!.value;

    const newList: List = {
      uuid: uuidv4(),
      name: listName.current!.value,
      description: listDescription.current!.value,
      imageUrl: listImage.current!.value,
      restaurants: []
    };

    setLists((prev) => {
      const updatedLists = [...prev];
      updatedLists.push(newList);
      return updatedLists;
    });

    // Reset input fields 
    listName.current!.value = '';
    listDescription.current!.value = '';
    listImage.current!.value = '';
    setShowAddModal(false);
  };

  return (
    <div className="relative h-screen p-16 sm:ml-64">
      <div className="flex justify-between mb-8">
        <h1 className="text-4xl font-semibold">My lists</h1>
        <button className="self-start px-6 py-2 text-white font-bold bg-blue-900 rounded-lg cursor-pointer">Manage lists</button>
      </div>
      <div className="grid grid-cols-6 gap-16 mb-4">
        {lists.map((list, index) => renderList(list, index))}
        <div className="flex items-start h-full">
          <div className="flex items-center justify-center w-full aspect-square rounded-lg bg-gray-200 cursor-pointer" onClick={() => setShowAddModal(true)}>
            <p className="text-2xl text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </p>
          </div>
        </div>
      </div>
      {/* Modal for creating a new list */
        showAddModal && (
          <div className="absolute flex items-center justify-center inset-0 w-full h-full bg-(--modal-background)">
            <div className="relative px-6 py-8 w-2/5 bg-white rounded-lg">
              <div className="p-4 flex items-center justify-between">
                <h2 className="text-3xl font-semibold text-blue-900">New list</h2>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 cursor-pointer" onClick={() => setShowAddModal(false)}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <hr className="border-gray-300" />
              <div className="p-4 flex flex-col">
                <label htmlFor="list-name" className="pb-1 font-semibold">Name</label>
                <input id="list-name" type="text" ref={listName} className="px-2 py-1 border border-black border-solid rounded-sm mb-6 focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)" autoComplete="off" />
                <label htmlFor="list-description" className="pb-1 font-semibold">Description</label>
                <input id="list-description" type="text" ref={listDescription} className="px-2 py-1 border border-black border-solid rounded-sm mb-6 focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)" autoComplete="off" />
                <label htmlFor="list-image" className="pb-1 font-semibold">Image</label>
                <input id="list-image" type="text" ref={listImage} className="px-2 py-1 border border-black border-solid rounded-sm mb-6 focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)" autoComplete="off" />
                <button className="px-4 py-2 self-start text-white font-bold bg-blue-900 rounded-lg cursor-pointer" onClick={handleAddClick}>Create</button>
              </div>
            </div>
          </div>
        )
      }
      {/* Modal for images */
        showImageModal && (
          <div className="absolute flex items-center justify-center inset-0 w-full h-full bg-(--modal-background)">
            <div className="relative px-6 py-8 w-2/5 bg-white rounded-lg">
              <div className="p-4 flex items-center justify-between">
                <h2 className="text-3xl font-semibold text-blue-900">Edit image</h2>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 cursor-pointer" onClick={() => setShowImageModal(false)}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <hr className="border-gray-300" />
              <div className="p-4 flex flex-col">
                <label htmlFor="list-image" className="pb-1 font-semibold">Image</label>
                <div>
                  <input id="list-image" type="text" className="px-2 py-1 border border-black border-solid rounded-sm mb-6 focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)" autoComplete="off" />
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}