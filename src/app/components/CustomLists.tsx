import { useState, useRef } from 'react';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { List, Lists } from "../interfaces/interfaces";

interface Props {
  lists: Lists;
  setLists: React.Dispatch<React.SetStateAction<Lists>>;
}

export const CustomLists: React.FC<Props> = ({ lists, setLists }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const listName = useRef<HTMLInputElement | null>(null);
  const listDescription = useRef<HTMLInputElement | null>(null);
  const listImage = useRef<HTMLInputElement | null>(null);

  // const handleClick = () => {
  //   const newRestaurant: Restaurant = {
  //       id: "1",
  //       name: "TP TEA",
  //       rating: 0,
  //       location: "Cupertino, CA",
  //       description: "TBD",
  //       visited: true,
  //       imageUrl: "https://placehold.co/200",
  //       dishes: []
  //   };

  //   setLists((prev) => {
  //     const updatedLists = [...prev];
  //     updatedLists[0].restaurants.push(newRestaurant);
  //     return updatedLists;
  //   }
  //   );
  // };

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

  const handleAddClick = () => {
    if (listName.current!.value === '') {
      alert("Please enter a list name");
    } else {
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
    }
  };

  return (
    <div className="relative h-screen p-16 sm:ml-64">
      <div className="flex justify-between mb-8">
        <h1 className="text-4xl font-semibold">My lists</h1>
        <button className="self-start px-6 py-2 text-white font-bold bg-blue-900 rounded-lg cursor-pointer">Manage lists</button>
      </div>
      <div className="grid grid-cols-6 gap-16 mb-4">
        {lists.map((list, index) => {
          return (
            <div className="flex flex-col gap-2 relative rounded-sm">
              <Link key={lists[index].uuid} href={`/list/${lists[index].uuid}`}>
                <div className="group">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="hidden group-hover:block absolute top-2 right-2 size-9 z-99" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowImageModal(true); }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                  <img className="aspect-square rounded-lg mb-2" src={lists[index].imageUrl} alt={lists[index].name} />
                </div>
              </Link>
              <input className="text-2xl font-semibold px-2 py-1 border border-transparent border-solid rounded-sm focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)" value={lists[index].name} onChange={(e) => handleChange(e, index, "name")}></input>
              <textarea className="text-lg/6 resize-none px-2 py-1 border border-transparent border-solid rounded-sm focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)" value={lists[index].description} onChange={(e) => handleChange(e, index, "description")}></textarea>
            </div>
          );
        })}
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