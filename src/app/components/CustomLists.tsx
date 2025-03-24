import { useState, useRef } from 'react';
import Link  from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { List, Lists } from "../interfaces/interfaces";

interface Props {
  lists: Lists;
  setLists: React.Dispatch<React.SetStateAction<Lists>>;
}

export const CustomLists: React.FC<Props> = ({ lists, setLists }) => {
  const [showModal, setShowModal] = useState(false);

  const listName = useRef<HTMLInputElement | null>(null);
  const listDescription = useRef<HTMLInputElement | null>(null);
  const listImage = useRef<HTMLInputElement | null>(null);

  // const handleClick2 = () => {
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

  const handleClick = () => {
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
      setShowModal(false);
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
            <Link key={lists[index].uuid} href={`/list/${lists[index].uuid}`}>
              <div className="flex flex-col gap-2 rounded-sm cursor-pointer">
                <img className="aspect-square rounded-lg mb-2" src={lists[index].imageUrl} alt={lists[index].name} />
                <h3 className="text-2xl font-semibold">{lists[index].name}</h3>
                {lists[index].description !== '' && (<p className="text-lg">{lists[index].description}</p>)}
              </div>
            </Link>
          );
        })}
        <div className="flex items-start h-full">
          <div className="flex items-center justify-center w-full aspect-square rounded-lg bg-gray-200 cursor-pointer" onClick={() => setShowModal(true)}>
            <p className="text-2xl text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </p>
          </div>
        </div>
      </div>
      {/* Modal for creating a new list */
        showModal && (
          <div className="absolute flex items-center justify-center inset-0 w-full h-full bg-(--modal-background)">
            <div className="relative px-6 py-8 w-2/5 bg-white rounded-lg">
              <div className="p-4 flex items-center justify-between">
                <h2 className="text-3xl font-semibold text-blue-900">New list / Edit list</h2>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 cursor-pointer" onClick={() => setShowModal(false)}>
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
                <button className="px-4 py-2 self-start text-white font-bold bg-blue-900 rounded-lg cursor-pointer" onClick={handleClick}>Create</button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}