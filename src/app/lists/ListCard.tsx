'use client';

import { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';
import Link from 'next/link';
import { User, List } from '@/app/interfaces/interfaces';
import ImageInput from '@/app/components/ImageInput';
import { uploadImage } from '@/app/lib/uploadImage';
import { removeUser } from '@/app/actions/user';
import { updateList, deleteList, removeList, moveList } from '@/app/actions/list';
import { getToken } from '@/app/actions/invitation';

export default function ListCard({
  userId, role, list, users
}: {
  userId: string, role: string, list: List, users: User[]
}) {
  // States for modals & alerts
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);
  const [collaboratorToRemove, setCollaboratorToRemove] = useState<User | null>(null);

  // States for the input fields in the edit modal
  const [inputName, setInputName] = useState(list.name);
  const [inputVisibility, setInputVisibility] = useState(list.visibility);
  const [inputDescription, setInputDescription] = useState(list.description);
  const [inputImage, setInputImage] = useState(list.photoUrl);

  const [invitationUrl, setInvitationUrl] = useState('');

  const handleShareClick = async () => {
    setShowMenuModal(false);
    const token = await getToken(userId, list._id);
    setInvitationUrl(`${window.location.protocol}//${window.location.host}/invite/${token}`);
    setShowShareModal(true);
  }

  return (
    <div key={list._id}
      className="relative flex flex-col bg-snowwhite rounded-sm">
      <Link href={`/list/${list._id}`}>
        <img src={list.photoUrl} alt={list.name} className="aspect-square rounded-lg" />
      </Link>
      <div className="flex flex-col py-4">
        <div className="relative flex justify-between">
          <Link href={`/list/${list._id}`}>
            <p>
              <span className="text-2xl font-semibold">{list.name}</span>
              <span className="text-lg capitalize"> ({role})</span>
            </p>
          </Link>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9 cursor-pointer"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenuModal(!showMenuModal); }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
          { // Modal for owner's menu options
            showMenuModal && role === 'owner' && (
              <div className="absolute right-0 top-8 min-w-30 p-2 flex flex-col bg-snowwhite border border-lightgray rounded-sm">
                <button
                  className="px-2 py-1 text-left rounded-sm cursor-pointer hover:bg-lightpink"
                  onClick={() => { setShowMenuModal(false); setShowEditModal(true); }}>
                  Edit
                </button>
                <button
                  className="px-2 py-1 text-left rounded-sm cursor-pointer hover:bg-lightpink"
                  onClick={handleShareClick}>
                  Share
                </button>
                <button
                  className="px-2 py-1 text-left rounded-sm cursor-pointer hover:bg-lightpink"
                  onClick={() => { setShowMenuModal(false); setShowDeleteAlert(true); }}>
                  Delete
                </button>
              </div>
            )
          }
          { // Modal for collaborator's menu options
            showMenuModal && role === 'collaborator' && (
              <div className="absolute right-0 top-8 min-w-30 p-2 flex flex-col bg-snowwhite border border-lightgray rounded-sm">
                <button
                  className="px-2 py-1 text-left rounded-sm cursor-pointer hover:bg-lightpink"
                  onClick={() => { setShowMenuModal(false); setShowRemoveAlert(true); }}>
                  Remove
                </button>
              </div>
            )
          }
        </div>
        <p className="py-1 text-lg/6 whitespace-pre-line">{list.description}</p>
      </div>
      { // Modal for editing lists
        showEditModal && (
          <div className="fixed h-full w-full inset-0 flex items-center justify-center bg-(--modal-background) z-99">
            <div className="relative px-6 py-8 w-2/5 bg-snowwhite rounded-lg">
              <div className="p-4 flex items-center justify-between">
                <h2 className="text-3xl font-semibold text-darkpink">Edit {list.name}</h2>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 cursor-pointer" onClick={() => { setShowEditModal(false) }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <hr className="border-slategray" />
              <form action={async (formData) => {
                let inputPhotoId: string | null = '';

                if (inputImage === list.photoUrl) {
                  // If there is no change to the image, don't re-upload it into the database
                  inputPhotoId = inputImage.split('=')[1];
                } else if (inputImage !== '') {
                  inputPhotoId = await uploadImage(inputImage);
                  if (inputPhotoId === null) return;
                } else {
                  // If no image is provided, use a default image
                  inputPhotoId = process.env.NEXT_PUBLIC_PLACEHOLDER_IMG!;
                }

                await updateList(formData, list._id, inputPhotoId);
                setShowEditModal(false);
              }} className="p-4 flex flex-col">
                <label htmlFor="list-name" className="pb-1 font-semibold">Name</label>
                <input id="list-name" name="list-name" type="text" value={inputName} onChange={(e) => setInputName(e.target.value)}
                  className="w-full px-2 py-1 mb-6 border border-charcoal rounded-sm focus:outline-none focus:border-darkpink focus:shadow-(--input-shadow)" autoComplete="off" />
                <fieldset className="mb-4">
                  <legend className="pb-1 font-semibold">Visibility</legend>
                  <label className="mr-4">
                    <input type="radio" name="list-visibility" value="private" className="mr-1"
                      checked={inputVisibility === 'private'} onChange={() => setInputVisibility('private')} />Private
                  </label>
                  <label>
                    <input type="radio" name="list-visibility" value="public" className="mr-1"
                      checked={inputVisibility === 'public'} onChange={() => setInputVisibility('public')} />Public
                  </label>
                </fieldset>
                <label htmlFor="list-description" className="pb-1 font-semibold">Description</label>
                <textarea id="list-description" name="list-description" placeholder="Add a description for this list" value={inputDescription} onChange={(e) => setInputDescription(e.target.value)}
                  className="px-2 py-1 mb-6 border border-charcoal rounded-sm focus:outline-none focus:border-darkpink focus:shadow-(--input-shadow)"></textarea>
                <ImageInput currImage={inputImage} setNewImage={(newImage) => setInputImage(newImage)} />
                <button type="submit" className="px-4 py-2 self-start text-snowwhite font-bold bg-darkpink rounded-lg cursor-pointer hover:bg-mauve transition-colors">
                  Update
                </button>
              </form>
            </div>
          </div>
        )
      }
      { // Modal for sharing lists
        showShareModal && (
          <div className="fixed h-full w-full inset-0 flex items-center justify-center bg-(--modal-background) z-99">
            <div className="relative px-6 py-8 min-w-fit w-1/4 bg-snowwhite rounded-lg">
              <div className="p-4 flex items-center justify-between">
                <h2 className="text-3xl font-semibold text-darkpink">Share {list.name}</h2>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 cursor-pointer" onClick={() => { setShowShareModal(false) }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <hr className="border-slategray" />
              <div className="p-4 mt-2 flex gap-2">
                <p className="w-full px-2 py-1 text-lg border border-charcoal rounded-sm">{invitationUrl}</p>
                <button className="w-fit px-2 py-1 border border-charcoal rounded-sm cursor-pointer"
                  title="Copy link" onClick={() => { navigator.clipboard.writeText(invitationUrl) }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <h4 className="mb-4 text-xl font-semibold">People with access</h4>
                {users.map((user: User) => (
                  <div key={user._id} className="w-full mb-2 flex items-center justify-between">
                    <p>
                      <span className="font-semibold">{user.name}</span>
                      {user._id === list.owner && (<span className="font-semibold"> (you)</span>)}<br />
                      <span className="opacity-75">{user.email}</span>
                    </p>
                    {user._id === list.owner && (<p className="opacity-75">Owner</p>)}
                    {user._id !== list.owner && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                        className="size-6 opacity-75 cursor-pointer" onClick={() => { setCollaboratorToRemove(user); }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
              <button type="button"
                className="px-4 py-2 mt-4 ml-4 self-start text-snowwhite font-bold bg-darkpink rounded-lg cursor-pointer hover:bg-mauve transition-colors"
                onClick={() => { setShowShareModal(false) }}>
                Done
              </button>
            </div>
          </div>
        )
      }
      { // Alert for deleting lists
        showDeleteAlert && (
          <div className="fixed h-full w-full inset-0 flex items-center justify-center bg-(--modal-background) z-99">
            <div role="alert" className="relative px-6 py-8 w-1/5 bg-snowwhite rounded-lg">
              <h3 className="mb-4 text-2xl font-semibold text-darkpink">Are you sure you want to delete this list?</h3>
              <div className="flex">
                <button type="button"
                  className="px-8 py-1.5 mr-4 text-sm text-snowwhite font-semibold text-center bg-darkpink rounded-lg cursor-pointer hover:bg-mauve transition-colors"
                  onClick={() => { deleteList(list._id) }}>
                  Yes
                </button>
                <button type="button"
                  className="px-8 py-1.5 text-sm text-darkpink font-semibold text-center bg-transparent border border-darkpink rounded-lg cursor-pointer hover:text-mauve hover:border-mauve transition-colors"
                  onClick={() => { setShowDeleteAlert(false) }}>
                  No
                </button>
              </div>
            </div>
          </div>
        )
      }
      { // Alert for removing lists
        showRemoveAlert && (
          <div className="fixed h-full w-full inset-0 flex items-center justify-center bg-(--modal-background) z-99">
            <div role="alert" className="relative px-6 py-8 w-1/5 bg-snowwhite rounded-lg">
              <h3 className="mb-4 text-2xl font-semibold text-darkpink">Are you sure you want to remove this list?</h3>
              <div className="flex">
                <button type="button"
                  className="px-8 py-1.5 mr-4 text-sm text-snowwhite font-semibold text-center bg-darkpink rounded-lg cursor-pointer hover:bg-mauve transition-colors"
                  onClick={() => { removeList(userId, list._id) }}>
                  Yes
                </button>
                <button type="button"
                  className="px-8 py-1.5 text-sm text-darkpink font-semibold text-center bg-transparent border border-darkpink rounded-lg cursor-pointer hover:text-mauve hover:border-mauve transition-colors"
                  onClick={() => { setShowRemoveAlert(false) }}>
                  No
                </button>
              </div>
            </div>
          </div>
        )
      }
      { // Alert for removing collaborators
        collaboratorToRemove && (
          <div className="fixed h-full w-full inset-0 flex items-center justify-center bg-(--modal-background) z-99">
            <div role="alert" className="relative px-6 py-8 w-1/5 bg-snowwhite rounded-lg">
              <h3 className="mb-4 text-2xl font-semibold text-darkpink">Are you sure you want to remove this user as a collaborator?</h3>
              <div className="flex">
                <button type="button"
                  className="px-8 py-1.5 mr-4 text-sm text-snowwhite font-semibold text-center bg-darkpink rounded-lg cursor-pointer hover:bg-mauve transition-colors"
                  onClick={() => { removeUser(collaboratorToRemove._id, list._id); setCollaboratorToRemove(null); }}>
                  Yes
                </button>
                <button type="button"
                  className="px-8 py-1.5 text-sm text-darkpink font-semibold text-center bg-transparent border border-darkpink rounded-lg cursor-pointer hover:text-mauve hover:border-mauve transition-colors"
                  onClick={() => { setCollaboratorToRemove(null) }}>
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