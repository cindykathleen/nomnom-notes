import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Lists, List } from "@/app/interfaces/interfaces";
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
  const listDescription = useRef<HTMLInputElement | null>(null);

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

  const renderList = useCallback((list: List) => {
    return (
      <ListCard key={list._id} list={list}
        setSelectedList={setSelectedList}
        setShowEditModal={setShowEditModal}
        setShowDeleteAlert={setShowDeleteAlert}
        setInputName={setInputName}
        setInputDescription={setInputDescription}
        setInputImage={setInputImage}
        moveList={moveList} />
    )
  }, [])

  const handleAddClick = async () => {
    if (listName.current!.value === '') {
      alert("Please enter a list name");
      return;
    }

    let inputPhotoID: string | null = '';

    if (inputImage !== '') {
      inputPhotoID = await uploadImage(inputImage);
      if (inputPhotoID === null) return;
    } else {
      inputPhotoID = 'placeholder';
    }

    const highestIndex = lists.length === 0 ? 0 : Math.max(...lists.map(list => list.index));

    const newList: List = {
      _id: uuidv4(),
      index: highestIndex + 1,
      name: listName.current!.value,
      description: listDescription.current!.value,
      photoId: inputPhotoID,
      photoUrl: `/api/database/photos?id=${inputPhotoID}`,
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

  const handleUpdateClick = async (id: string) => {
    let inputPhotoID: string | null = '';

    if (inputImage !== '') {
      inputPhotoID = await uploadImage(inputImage);
      if (inputPhotoID === null) return;
    } else {
      inputPhotoID = 'placeholder';
    }

    const updatedList: Partial<List> = {
      _id: id,
      name: inputName,
      description: inputDescription,
      photoId: inputPhotoID,
      photoUrl: `/api/database/photos?id=${inputPhotoID}`
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
    <div className="relative h-screen p-16 sm:ml-64">
      <h1 className="text-4xl mb-8 font-semibold">My lists</h1>
      <div className="grid grid-cols-6 gap-16 mb-4">
        {lists.map(list => renderList(list))}
        <div className="flex items-start h-full">
          <div className="flex items-center justify-center w-full aspect-square rounded-lg bg-gray-200 cursor-pointer" onClick={() => { setInputImage(''); setShowAddModal(true); }}>
            <p className="text-2xl text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </p>
          </div>
        </div>
      </div>
      { // Modal for creating a new list
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
                <ImageInput currImage={inputImage} setNewImage={(newImage) => setInputImage(newImage)} />
                <button className="px-4 py-2 self-start text-white font-bold bg-blue-900 rounded-lg cursor-pointer" onClick={handleAddClick}>Create</button>
              </div>
            </div>
          </div>
        )
      }
      { // Modal for editing lists
        // This modal is in this component instead of ListComponent so it can span the entire screen
        showEditModal && selectedList && (
          <div className="absolute flex items-center justify-center inset-0 w-full h-full bg-(--modal-background)">
            <div className="relative px-6 py-8 w-2/5 bg-white rounded-lg">
              <div className="p-4 flex items-center justify-between">
                <h2 className="text-3xl font-semibold text-blue-900">Edit {selectedList.name}</h2>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 cursor-pointer" onClick={() => { setSelectedList(null); setShowEditModal(false); }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <hr className="border-gray-300" />
              <div className="p-4 flex flex-col">
                <label htmlFor="list-name" className="pb-1 font-semibold">Name</label>
                <input id="list-name" type="text" value={inputName} onChange={(e) => setInputName(e.target.value)}
                  className="w-full px-2 py-1 mb-6 border border-black border-solid rounded-sm focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)" autoComplete="off" />
                <label htmlFor="list-description" className="pb-1 font-semibold">Description</label>
                <textarea id="list-description" placeholder="Add a description for this list" value={inputDescription} onChange={(e) => setInputDescription(e.target.value)}
                  className="px-2 py-1 border border-black border-solid rounded-sm mb-6 focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)"></textarea>
                <ImageInput currImage={inputImage} setNewImage={(newImage) => setInputImage(newImage)} />
                <button className="px-4 py-2 self-start text-white font-bold bg-blue-900 rounded-lg cursor-pointer" onClick={() => handleUpdateClick(selectedList._id)}>Update</button>
              </div>
            </div>
          </div>
        )
      }
      { // Alert for deleting lists
        // This modal is in this component instead of ListComponent so it can span the entire screen
        showDeleteAlert && selectedList && (
          <div className="absolute flex items-center justify-center inset-0 w-full h-full bg-(--modal-background)">
            <div role="alert" className="relative px-6 py-8 w-1/5 border border-gray-300 rounded-lg bg-gray-50">
              <h3 className="mb-4 text-2xl font-semibold text-blue-900">Are you sure you want to delete this dish?</h3>
              <div className="flex">
                <button type="button"
                  className="px-8 py-1.5 mr-4 text-sm text-white text-center bg-blue-900 focus:ring-2 focus:outline-none focus:ring-gray-300 rounded-lg cursor-pointer"
                  onClick={(e) => { handleDeleteClick(selectedList._id) }}>
                  Yes
                </button>
                <button type="button"
                  className="px-8 py-1.5 text-sm text-blue-900 text-center bg-transparent border border-blue-900 focus:ring-2 focus:outline-none focus:ring-gray-300 rounded-lg cursor-pointer"
                  onClick={() => { setSelectedList(null); setShowDeleteAlert(false); }}>
                  No
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}