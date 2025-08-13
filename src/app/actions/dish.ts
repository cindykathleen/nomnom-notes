'use server';

import { db } from '@/app/lib/database';
import { Dish } from '@/app/interfaces/interfaces';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export const addDish = async (formData: FormData, restaurantId: string, rating: number, photoId: string) => {
  const name = formData.get('dish-name') as string;
  const note = formData.get('dish-note') as string;

  let restaurant;

  try {
    restaurant = await db.getRestaurant(restaurantId);

    if (!restaurant) {
      return { error: 'Error fetching restaurant' };
    }
  } catch (err) {
    return { error: `Error fetching restaurant: ${err}` };
  }

  const highestIndex = await db.getHighestDishIndex(restaurantId) || 0;

  const newDish: Dish = {
    _id: uuidv4(),
    index: highestIndex + 1,
    name: name,
    note: note,
    rating: rating,
    photoId: photoId,
    photoUrl: `/api/database/photos?id=${photoId}`
  };

  try {
    await db.addDish(restaurantId, newDish);
    revalidatePath('/restaurant');
    return { message: 'Dish added successfully' };
  } catch (err) {
    return { error: `Error adding dish: ${err}` };
  }
}

export const updateDish = async (formData: FormData, id: string, rating: number, photoId: string) => {
  const name = formData.get('dish-name') as string;
  const note = formData.get('dish-note') as string;

  try {
    const existingDish = await db.getDish(id);

    if (!existingDish) {
      return { error: 'List not found' };
    }

    const updatedDish: Dish = {
      ...existingDish,
      name: name,
      note: note,
      rating: rating,
      photoId: photoId,
      photoUrl: `/api/database/photos?id=${photoId}`,
    };

    await db.updateDish(updatedDish);
    revalidatePath('/restaurant');
    return { message: 'Dish updated successfully' };
  } catch (err) {
    return { error: `Error updating dish: ${err}` };
  }
}

export const deleteDish = async (restaurantId: string, dishId: string) => {
  try {
    await db.deleteDish(restaurantId, dishId);
    revalidatePath('/restaurant');
    return { message: 'Dish deleted successfully' };
  } catch (err) {
    return { error: `Error deleting dish: ${err}` };
  }
}

export const moveDish = async (dragIndex: number, hoverIndex: number) => {
  try {
    await db.moveItem('dishes', dragIndex, hoverIndex);
    revalidatePath('/restaurant');
    return { message: 'Drag & drop implemented successfully' };
  } catch (err) {
    return { error: `Error dragging & dropping items: ${err}` };
  }
}