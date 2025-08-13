'use server';

import { db } from '@/app/lib/database';
import { Restaurant } from "@/app/interfaces/interfaces";
import { revalidatePath } from 'next/cache';

export const editRestaurant = async (formData: FormData, id: string, rating: number) => {
  const description = formData.get('restaurant-description') as string;

  try {
    const existingRestaurant = await db.getRestaurant(id);

    if (!existingRestaurant) {
      return { error: 'Restaurant not found' };
    }

    const updatedRestaurant: Restaurant = {
      ...existingRestaurant,
      rating: rating,
      description: description,
    };

    await db.updateRestaurant(updatedRestaurant);
    revalidatePath('/list');
    return { message: 'Restaurant updated successfully' };
  } catch (err) {
    return { error: `Error updating restaurant: ${err}` };
  }
}

export const deleteRestaurant = async (listId: string, restaurantId: string) => {
  try {
    await db.deleteRestaurant(listId, restaurantId);
    revalidatePath('/list');
    return { message: 'Restaurant deleted successfully' };
  } catch (err) {
    return { error: `Error deleting restaurant: ${err}` };
  }
}