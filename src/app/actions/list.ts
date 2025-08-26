'use server';

import { db } from '@/app/lib/database';
import { List } from "@/app/interfaces/interfaces";
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export const addList = async (userId: string, formData: FormData, photoId: string) => {
  const name = formData.get('list-name') as string;
  const description = formData.get('list-description') as string;

  let lists;

  try {
    lists = await db.getLists(userId);

    if (!lists) {
      return { error: 'Error fetching lists' };
    }
  } catch (err) {
    return { error: `Error fetching lists: ${err}` };
  }

  const highestIndex = lists.length === 0 ? 0 : Math.max(...lists.map((list: List) => list.index));

  const newList: List = {
    _id: uuidv4(),
    index: highestIndex + 1,
    name: name,
    description: description,
    photoId: photoId,
    photoUrl: `/api/database/photos?id=${photoId}`,
    restaurants: []
  };

  try {
    await db.addList(userId, newList);
    revalidatePath('/lists');
    return { message: 'List added successfully' };
  } catch (err) {
    return { error: `Error adding list: ${err}` };
  }
}

export const updateList = async (userId: string, formData: FormData, listId: string, photoId: string) => {
  const name = formData.get('list-name') as string;
  const description = formData.get('list-description') as string;

  try {
    const existingList = await db.getList(userId, listId);

    if (!existingList) {
      return { error: 'List not found' };
    }

    const updatedList: List = {
      ...existingList,
      name: name,
      description: description,
      photoId: photoId,
      photoUrl: `/api/database/photos?id=${photoId}`,
    };

    await db.updateList(userId, updatedList);
    revalidatePath('/lists');
    return { message: 'List updated successfully' };
  } catch (err) {
    return { error: `Error updating list: ${err}` };
  }
}

export const deleteList = async (userId: string, listId: string) => {
  try {
    await db.deleteList(userId, listId);
    revalidatePath('/lists');
    return { message: 'List deleted successfully' };
  } catch (err) {
    return { error: `Error deleting list: ${err}` };
  }
}

export const moveList = async (userId: string, dragIndex: number, hoverIndex: number) => {
  try {
    await db.moveList(userId, dragIndex, hoverIndex);
    revalidatePath('/lists');
    return { message: 'Drag & drop implemented successfully' };
  } catch (err) {
    return { error: `Error dragging & dropping items: ${err}` };
  }
}