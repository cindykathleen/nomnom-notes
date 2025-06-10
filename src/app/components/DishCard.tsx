import { useState } from 'react';
import { useListsContext } from '@/app/context/ListsContext';
import { List, Restaurant, Dish } from '@/app/interfaces/interfaces';
import { RatingDisplay } from '@/app/components/RatingDisplay';
import { RatingSystem } from '@/app/components/RatingSystem';
import { ImageInput } from '@/app/components/ImageInput';
import { uploadImage } from '@/app/lib/uploadImage';

interface Props {
  list: List;
  restaurant: Restaurant;
  dish: Dish;
}

export const DishCard: React.FC<Props> = ({ list, restaurant, dish }) => {
  const { setLists } = useListsContext();
  const [showMenuModal, setShowMenuModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);

  // States for the input fields in the edit modal
  const [inputName, setInputName] = useState<string>(dish.name);
  const [inputNote, setInputNote] = useState<string>(dish.note);
  const [inputImage, setInputImage] = useState<string>(dish.photo || '');
  const [ratingHover, setRatingHover] = useState<boolean>(false);

  const handleUpdateClick = async () => {
    let inputPhotoID: string | null = '';

    if (inputImage !== '') {
      inputPhotoID = await uploadImage(inputImage);
      if (inputPhotoID === null) return;
    } else {
      inputPhotoID = 'placeholder';
    }

    setLists((prev) => {
      const updatedLists = [...prev];
      const listIndex = updatedLists.findIndex((l) => l.uuid === list.uuid);
      const restaurantIndex = updatedLists[listIndex].restaurants.findIndex((r) => r.id === restaurant.id);
      const dishIndex = updatedLists[listIndex].restaurants[restaurantIndex].dishes.findIndex((d) => d.name === dish.name);
      updatedLists[listIndex].restaurants[restaurantIndex].dishes[dishIndex].name = inputName;
      updatedLists[listIndex].restaurants[restaurantIndex].dishes[dishIndex].note = inputNote;
      updatedLists[listIndex].restaurants[restaurantIndex].dishes[dishIndex].photo = inputPhotoID;
      updatedLists[listIndex].restaurants[restaurantIndex].dishes[dishIndex].photoUrl = `/uploads/${inputPhotoID}`;

      return updatedLists;
    })

    setShowEditModal(false);
  };

  const handleDeleteClick = () => {
    setLists((prev) => {
      const updatedLists = [...prev];
      const listIndex = updatedLists.findIndex((l) => l.uuid === list.uuid);
      const restaurantIndex = updatedLists[listIndex].restaurants.findIndex((r) => r.id === restaurant.id);
      const dishIndex = updatedLists[listIndex].restaurants[restaurantIndex].dishes.findIndex((d) => d.name === dish.name);
      updatedLists[listIndex].restaurants[restaurantIndex].dishes.splice(dishIndex, 1);

      return updatedLists;
    })

    setShowDeleteAlert(false);
  };

  return (
    <div className="flex flex-col border border-gray-200 rounded-lg">
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
                  onClick={() => { setShowMenuModal(false); setShowEditModal(true); setInputImage(dish.photoUrl); }}>
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
        <p>{dish.note}</p>
      </div>
      { // Modal for editing a dish
        showEditModal && (
          <div className="absolute flex items-center justify-center inset-0 w-full h-full bg-(--modal-background)">
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
                    ? <RatingSystem currRating={dish.rating}
                      setNewRating={
                        (newRating) => {
                          setLists((prev) => {
                            const updatedLists = [...prev];
                            const listIndex = updatedLists.findIndex((l) => l.uuid === list.uuid);
                            const restaurantIndex = updatedLists[listIndex].restaurants.findIndex((r) => r.id === restaurant.id);
                            const dishIndex = updatedLists[listIndex].restaurants[restaurantIndex].dishes.findIndex((d) => d.name === dish.name);
                            updatedLists[listIndex].restaurants[restaurantIndex].dishes[dishIndex].rating = newRating;
                            return updatedLists;
                          });
                        }
                      }
                    />
                    : <RatingDisplay rating={dish.rating} />}
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
          <div className="absolute flex items-center justify-center inset-0 w-full h-full bg-(--modal-background)">
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