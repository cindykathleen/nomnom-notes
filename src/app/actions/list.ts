'use server';

import { addListDb, getList, updateListDb, deleteListDb,
  removeListDb, moveListDb } from '@/app/lib/dbFunctions';
import { List } from "@/app/interfaces/interfaces";
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export const addList = async (userId: string, formData: FormData, photoUrl: string) => {
  const name = formData.get('list-name') as string;
  const visibility = formData.get('list-visibility') as 'private' | 'public';
  const description = formData.get('list-description') as string;

  const newList: List = {
    _id: uuidv4(),
    owner: userId,
    visibility: visibility,
    name: name,
    description: description,
    photoUrl: photoUrl,
    restaurants: []
  };

  try {
    await addListDb(userId, newList);
    revalidatePath('/lists');
    return { message: 'List added successfully' };
  } catch (err) {
    return { error: `Error adding list: ${err}` };
  }
}

export const updateList = async (formData: FormData, listId: string, photoUrl: string) => {
  const name = formData.get('list-name') as string;
  const visibility = formData.get('list-visibility') as 'private' | 'public';
  const description = formData.get('list-description') as string;

  try {
    const existingList = await getList(listId);

    if (!existingList) {
      return { error: 'List not found' };
    }

    const updatedList: List = {
      ...existingList,
      name: name,
      visibility: visibility,
      description: description,
      photoUrl: photoUrl,
    };

    await updateListDb(updatedList);
    revalidatePath('/lists');
    return { message: 'List updated successfully' };
  } catch (err) {
    return { error: `Error updating list: ${err}` };
  }
}

export const deleteList = async (listId: string) => {
  try {
    await deleteListDb(listId);
    revalidatePath('/lists');
    return { message: 'List deleted successfully' };
  } catch (err) {
    return { error: `Error deleting list: ${err}` };
  }
}

export const removeList = async (userId: string, listId: string) => {
  try {
    await removeListDb(userId, listId);
    revalidatePath('/lists');
    return { message: 'List removed successfully' };
  } catch (err) {
    return { error: `Error removing list: ${err}` };
  }
}

export const moveList = async (userId: string, dragIndex: number, hoverIndex: number) => {
  try {
    await moveListDb(userId, dragIndex, hoverIndex);
    revalidatePath('/lists');
    return { message: 'Drag & drop implemented successfully' };
  } catch (err) {
    return { error: `Error dragging & dropping items: ${err}` };
  }
}