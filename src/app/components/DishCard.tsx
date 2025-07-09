import { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';
import { Restaurant, Dish } from '@/app/interfaces/interfaces';
import { RatingDisplay } from '@/app/components/RatingDisplay';
import { RatingSystem } from '@/app/components/RatingSystem';
import { ImageInput } from '@/app/components/ImageInput';
import { uploadImage } from '@/app/lib/uploadImage';

interface Props {
  restaurant: Restaurant;
  dish: Dish;
  fetchRestaurant: () => void;
  moveList: (dragIndex: number, hoverIndex: number) => void; // Function used to reorder the lists
}

interface DragItem {
  index: number;
}

export const DishCard: React.FC<Props> = ({ restaurant, dish, fetchRestaurant, moveList }) => {
  // States for modals & alerts
  const [showMenuModal, setShowMenuModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);

  // States for the input fields in the edit modal
  const [inputName, setInputName] = useState<string>(dish.name);
  const [rating, setRating] = useState<number>(0);
  const [ratingHover, setRatingHover] = useState<boolean>(false);
  const [inputNote, setInputNote] = useState<string>(dish.note);
  const [inputImage, setInputImage] = useState<string>(dish.photoId || '');

  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: "dish",
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
      const hoverIndex = dish.index;

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
    type: "dish",
    item: () => {
      return { id: dish._id, index: dish.index }
    },
    // A collecting function that keeps track of the dragging state
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging()
    }),
  })

  // Setting ref to act as both a drag source and a drop target
  drag(drop(ref));

  const handleUpdateClick = async () => {
    let inputPhotoId: string | null = '';

    // If there is no change to the image, don't re-upload it into the database
    if (inputImage === dish.photoUrl) {
      inputPhotoId = inputImage.split('=')[1];
    } else if (inputImage !== '') {
      inputPhotoId = await uploadImage(inputImage);
      if (inputPhotoId === null) return;
    } else {
      inputPhotoId = '110eef21-e1df-4f07-9442-44cbca0b42fc';
    }

    const updatedDish: Partial<Dish> = {
      _id: dish._id,
      name: inputName,
      note: inputNote,
      rating: rating,
      photoId: inputPhotoId,
      photoUrl: `/api/database/photos?id=${inputPhotoId}`
    }

    await fetch('/api/database/dishes', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dish: updatedDish
      })
    })

    setShowEditModal(false);
    fetchRestaurant();
  };

  const handleDeleteClick = async () => {
    await fetch('/api/database/dishes', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        restaurantId: restaurant._id,
        dishId: dish._id
      })
    })

    setShowDeleteAlert(false);
    fetchRestaurant();
  };

  return (
    <div ref={ref} key={dish._id} className="flex flex-col border border-gray-200 rounded-lg cursor-pointer" data-handler-id={handlerId} >
      { // Check to make sure dish.imageUrl is not undefined, null or an empty string
        !!dish.photoUrl && (
          <img src={dish.photoUrl} alt={dish.name} className="aspect-square object-cover rounded-t-lg" />
        )
      }
      <div className="flex flex-col gap-2 p-4">
        <div className="flex justify-between relative">
          <h3 className="text-xl font-semibold">{dish.name}</h3>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
            className="ml-4 size-8 cursor-pointer"
            onClick={() => setShowMenuModal(!showMenuModal)}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
          {/* Modal for menu */
            showMenuModal && (
              <div className="flex flex-col absolute right-0 top-8 min-w-30 p-2 bg-white border border-gray-200 rounded-sm">
                <button
                  className="px-2 py-1 mb-2 text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => { setShowMenuModal(false); setShowEditModal(true); setRating(dish.rating); setInputImage(dish.photoUrl); }}>
                  Edit
                </button>
                <button
                  className="px-2 py-1 text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => { setShowMenuModal(false); setShowDeleteAlert(true); }}>
                  Delete
                </button>
              </div>
            )
          }
        </div>
        <RatingDisplay rating={dish.rating} />
        <p className="whitespace-pre-line">{dish.note}</p>
      </div>
      { // Modal for editing a dish
        showEditModal && (
          <div className="fixed flex items-center justify-center inset-0 w-full h-full bg-(--modal-background)">
            <div className="relative px-6 py-8 w-2/5 bg-white rounded-lg z-99">
              <div className="p-4 flex items-center justify-between">
                <h2 className="text-3xl font-semibold text-blue-900">Edit {dish.name}</h2>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 cursor-pointer" onClick={() => setShowEditModal(false)}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <hr className="border-gray-300" />
              <div className="p-4 flex flex-col">
                <label htmlFor="dish-name" className="pb-1 font-semibold">Name</label>
                <input id="dish-name" type="text" value={inputName} onChange={(e) => setInputName(e.target.value)}
                  className="w-full px-2 py-1 mb-6 border border-black border-solid rounded-sm focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)" autoComplete="off" />
                <label htmlFor="dish-rating" className="pb-1 font-semibold">Rating</label>
                <div id="dish-rating" className="w-fit mb-6" onMouseEnter={() => setRatingHover(true)} onMouseLeave={() => setRatingHover(false)}>
                  {ratingHover
                    ? <RatingSystem currRating={rating} setNewRating={newRating => setRating(newRating)} />
                    : <RatingDisplay rating={rating} />
                  }
                </div>
                <label htmlFor="dish-note" className="pb-1 font-semibold">Note</label>
                <textarea id="dish-note" placeholder="Add a note for this dish" value={inputNote} onChange={(e) => setInputNote(e.target.value)}
                  className="px-2 py-1 border border-black border-solid rounded-sm mb-6 focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)"></textarea>
                <ImageInput currImage={inputImage} setNewImage={(newImage) => setInputImage(newImage)} />
                <button className="px-4 py-2 self-start text-white font-bold bg-blue-900 rounded-lg cursor-pointer" onClick={handleUpdateClick}>Update</button>
              </div>
            </div>
          </div>
        )
      }
      { // Alert for deleting a dish
        showDeleteAlert && (
          <div className="fixed flex items-center justify-center inset-0 w-full h-full bg-(--modal-background)">
            <div role="alert" className="relative px-6 py-8 w-1/5 border border-gray-300 rounded-lg bg-gray-50">
              <h3 className="mb-4 text-2xl font-semibold text-blue-900">Are you sure you want to delete this dish?</h3>
              <div className="flex">
                <button type="button"
                  className="px-8 py-1.5 mr-4 text-sm text-white text-center bg-blue-900 focus:ring-2 focus:outline-none focus:ring-gray-300 rounded-lg cursor-pointer"
                  onClick={handleDeleteClick}>
                  Yes
                </button>
                <button type="button"
                  className="px-8 py-1.5 text-sm text-blue-900 text-center bg-transparent border border-blue-900 focus:ring-2 focus:outline-none focus:ring-gray-300 rounded-lg cursor-pointer"
                  onClick={() => setShowDeleteAlert(false)}>
                  No
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};