'use server';

import { db } from '@/app/lib/database';
import { Restaurant, Review } from "@/app/interfaces/interfaces";
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export const updateReview = async (formData: FormData, userId: string, restaurantId: string, rating: number) => {
  const note = formData.get('restaurant-note') as string;

  const existingReview = await db.getExistingReview(userId, restaurantId);
  let updatedReview: Review;

  if (!existingReview) {
    // Create a new review
    const name = await db.getUserName(userId);
    
    updatedReview = {
      _id: uuidv4(),
      createdBy: userId,
      name: name,
      rating: rating,
      note: note
    }
  } else {
    // Update the existing review
    updatedReview = {
      ...existingReview,
      rating: rating,
      note: note
    }
  }

  return updatedReview;
}

export const updateRestaurant = async (userId: string, restaurantId: string, updatedReview: Review) => {
  try {
    const existingReview = await db.getExistingReview(userId, restaurantId);
    const existingRestaurant = await db.getRestaurant(restaurantId);

    if (!existingRestaurant) {
      return { error: 'Restaurant not found' };
    }

    let updatedReviews: Review[];

    if (!existingReview) {
      // Add the new review
      updatedReviews = [...(existingRestaurant.reviews || []), updatedReview];
    } else {
      // Replace the existing review
      updatedReviews = (existingRestaurant.reviews || []).map((review) =>
        review.createdBy === userId ? updatedReview : review
      );
    }

    const updatedRestaurant: Restaurant = {
      ...existingRestaurant,
      reviews: updatedReviews
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