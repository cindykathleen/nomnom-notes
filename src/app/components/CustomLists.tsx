'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { List } from "@/app/interfaces/interfaces";
import { ListCard } from '@/app/components/ListCard';
import { ImageInput } from '@/app/components/ImageInput';
import { uploadImage } from '@/app/lib/uploadImage';

export const CustomLists = () => {
  const [lists, setLists] = useState<List[]>([]);

  // States for modals & alerts
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);

  // Refs for the input fields in the add modal
  const listName = useRef<HTMLInputElement | null>(null);
  const listDescription = useRef<HTMLTextAreaElement | null>(null);

  // States for the input fields in the edit modal
  const [inputName, setInputName] = useState<string>('');
  const [inputDescription, setInputDescription] = useState<string>('');
  const [inputImage, setInputImage] = useState<string>('');

  const fetchLists = async () => {
    const reponse = await fetch('/api/database/lists');
    const data = await reponse.json();
    setLists(data);
  }

  useEffect(() => {
    fetchLists()
  }, []);

  const moveList = useCallback(async (dragIndex: number, hoverIndex: number) => {
    await fetch('/api/database/drag-drop', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        collectionName: 'lists',
        dragIndex: dragIndex,
        hoverIndex: hoverIndex
      })
    })

    fetchLists()
  }, [])

  const handleAddClick = async () => {
    if (listName.current!.value === '') {
      alert("Please enter a list name");
      return;
    }

    let inputPhotoId: string | null = '';

    if (inputImage !== '') {
      inputPhotoId = await uploadImage(inputImage);
      if (inputPhotoId === null) return;
    } else {
      inputPhotoId = '110eef21-e1df-4f07-9442-44cbca0b42fc';
    }

    const highestIndex = lists.length === 0 ? 0 : Math.max(...lists.map(list => list.index));

    const newList: List = {
      _id: uuidv4(),
      index: highestIndex + 1,
      name: listName.current!.value,
      description: listDescription.current!.value,
      photoId: inputPhotoId,
      photoUrl: `/api/database/photos?id=${inputPhotoId}`,
      restaurants: []
    };

    await fetch('/api/database/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        list: newList,
      })
    });

    // Reset input fields 
    listName.current!.value = '';
    listDescription.current!.value = '';
    setInputImage('');
    setShowAddModal(false);

    await fetchLists();
  };

  const handleUpdateClick = async (list: List) => {
    let inputPhotoId: string | null = '';

    // If there is no change to the image, don't re-upload it into the database
    if (inputImage === list.photoUrl) {
      inputPhotoId = inputImage.split('=')[1];
    } else if (inputImage !== '') {
      inputPhotoId = await uploadImage(inputImage);
      if (inputPhotoId === null) return;
    } else {
      inputPhotoId = '110eef21-e1df-4f07-9442-44cbca0b42fc';
    }

    const updatedList: Partial<List> = {
      _id: list._id,
      name: inputName,
      description: inputDescription,
      photoId: inputPhotoId,
      photoUrl: `/api/database/photos?id=${inputPhotoId}`
    }

    await fetch('/api/database/list', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        list: updatedList
      })
    })

    setSelectedList(null);
    setShowEditModal(false);

    await fetchLists();
  };

  const handleDeleteClick = async (id: string) => {
    await fetch('/api/database/list', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id
      })
    })

    setSelectedList(null);
    setShowDeleteAlert(false);

    await fetchLists();
  }

  return (
    <div className="relative h-full w-screen p-16 mt-[80px] flex justify-center">
      <div className="max-w-[1440px] w-full px-8 flex flex-col space-y-8">
        <h1 className="text-4xl font-semibold">My lists</h1>
        <div className="grid grid-cols-4 gap-16">
          {lists.map(list => (
            <ListCard key={list._id} list={list}
              setSelectedList={setSelectedList}
              setShowEditModal={setShowEditModal}
              setShowDeleteAlert={setShowDeleteAlert}
              setInputName={setInputName}
              setInputDescription={setInputDescription}
              setInputImage={setInputImage}
              moveList={moveList} />
          ))}
          <div className="flex items-start h-full">
            <div className="flex items-center justify-center w-full aspect-square rounded-lg bg-lightgray cursor-pointer" onClick={() => { setInputImage(''); setShowAddModal(true); }}>
              <p className="text-2xl text-slategray">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </p>
            </div>
          </div>
        </div>
        { // Modal for creating a new list
          showAddModal && (
            <div className="fixed flex items-center justify-center inset-0 w-full h-full bg-(--modal-background)">
              <div className="relative px-6 py-8 w-2/5 bg-snowwhite rounded-lg">
                <div className="p-4 flex items-center justify-between">
                  <h2 className="text-3xl font-semibold text-darkpink">New list</h2>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 cursor-pointer" onClick={() => setShowAddModal(false)}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </div>
                <hr className="border-slategray" />
                <div className="p-4 flex flex-col">
                  <label htmlFor="list-name" className="pb-1 font-semibold">Name</label>
                  <input id="list-name" type="text" ref={listName} className="px-2 py-1 border border-charcoal border-solid rounded-sm mb-6 focus:outline-none focus:border-darkpink focus:shadow-(--input-shadow)" autoComplete="off" />
                  <label htmlFor="list-description" className="pb-1 font-semibold">Description</label>
                  <textarea id="list-description" ref={listDescription} className="px-2 py-1 border border-charcoal border-solid rounded-sm mb-6 focus:outline-none focus:border-darkpink focus:shadow-(--input-shadow)"></textarea>
                  <ImageInput currImage={inputImage} setNewImage={(newImage) => setInputImage(newImage)} />
                  <button className="px-4 py-2 self-start text-snowwhite font-bold bg-darkpink rounded-lg cursor-pointer hover:bg-mauve transition-colors" onClick={handleAddClick}>Create</button>
                </div>
              </div>
            </div>
          )
        }
        { // Modal for editing lists
          // This modal is in this component instead of ListComponent so it can span the entire screen
          showEditModal && selectedList && (
            <div className="fixed flex items-center justify-center inset-0 w-full h-full bg-(--modal-background)">
              <div className="relative px-6 py-8 w-2/5 bg-snowwhite rounded-lg">
                <div className="p-4 flex items-center justify-between">
                  <h2 className="text-3xl font-semibold text-darkpink">Edit {selectedList.name}</h2>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 cursor-pointer" onClick={() => { setSelectedList(null); setShowEditModal(false); }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </div>
                <hr className="border-slategray" />
                <div className="p-4 flex flex-col">
                  <label htmlFor="list-name" className="pb-1 font-semibold">Name</label>
                  <input id="list-name" type="text" value={inputName} onChange={(e) => setInputName(e.target.value)}
                    className="w-full px-2 py-1 mb-6 border border-charcoal border-solid rounded-sm focus:outline-none focus:border-darkpink focus:shadow-(--input-shadow)" autoComplete="off" />
                  <label htmlFor="list-description" className="pb-1 font-semibold">Description</label>
                  <textarea id="list-description" placeholder="Add a description for this list" value={inputDescription} onChange={(e) => setInputDescription(e.target.value)}
                    className="px-2 py-1 border border-charcoal border-solid rounded-sm mb-6 focus:outline-none focus:border-darkpink focus:shadow-(--input-shadow)"></textarea>
                  <ImageInput currImage={inputImage} setNewImage={(newImage) => setInputImage(newImage)} />
                  <button className="px-4 py-2 self-start text-snowwhite font-bold bg-darkpink rounded-lg cursor-pointer hover:bg-mauve transition-colors" onClick={() => handleUpdateClick(selectedList)}>Update</button>
                </div>
              </div>
            </div>
          )
        }
        { // Alert for deleting lists
          // This modal is in this component instead of ListComponent so it can span the entire screen
          showDeleteAlert && selectedList && (
            <div className="fixed flex items-center justify-center inset-0 w-full h-full bg-(--modal-background)">
              <div role="alert" className="relative px-6 py-8 w-1/5 border rounded-lg bg-snowwhite">
                <h3 className="mb-4 text-2xl font-semibold text-darkpink">Are you sure you want to delete this dish?</h3>
                <div className="flex">
                  <button type="button"
                    className="px-8 py-1.5 mr-4 text-sm text-snowwhite text-center bg-darkpink rounded-lg cursor-pointer hover:bg-mauve transition-colors"
                    onClick={() => { handleDeleteClick(selectedList._id) }}>
                    Yes
                  </button>
                  <button type="button"
                    className="px-8 py-1.5 text-sm text-darkpink text-center bg-transparent border border-darkpink rounded-lg cursor-pointer hover:text-mauve hover:border-mauve transition-colors"
                    onClick={() => { setSelectedList(null); setShowDeleteAlert(false); }}>
                    No
                  </button>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
}