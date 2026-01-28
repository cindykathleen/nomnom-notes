'use server';

import { getExistingRestaurantReview, getUserName, getRestaurant,
  updateRestaurantDb, deleteRestaurantDb } from '@/app/lib/dbFunctions';
import { Restaurant, Review } from "@/app/interfaces/interfaces";
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export const updateReview = async (formData: FormData, userId: string, restaurantId: string, rating: number) => {
  const note = formData.get('restaurant-note') as string;

  const existingReview = await getExistingRestaurantReview(userId, restaurantId);
  let updatedReview: Review;

  if (!existingReview) {
    // Create a new review
    const name = await getUserName(userId);
    
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
    const existingReview = await getExistingRestaurantReview(userId, restaurantId);
    const existingRestaurant = await getRestaurant(restaurantId);

    if (!existingRestaurant) {
      return { error: 'Restaurant not found' };
    }

    let updatedReviews: Review[];

    if (!existingReview) {
      // Add the new review
      updatedReviews = [...existingRestaurant.reviews, updatedReview];
    } else {
      // Replace the existing review
      updatedReviews = (existingRestaurant.reviews).map((review) =>
        review.createdBy === userId ? updatedReview : review
      );
    }

    const updatedRestaurant: Restaurant = {
      ...existingRestaurant,
      reviews: updatedReviews,
      dateUpdated: new Date(),
    };

    await updateRestaurantDb(updatedRestaurant);
    revalidatePath('/list');
    return { message: 'Restaurant updated successfully' };
  } catch (err) {
    return { error: `Error updating restaurant: ${err}` };
  }
}

export const deleteRestaurant = async (listId: string, restaurantId: string) => {
  try {
    await deleteRestaurantDb(listId, restaurantId);
    revalidatePath('/list');
    return { message: 'Restaurant deleted successfully' };
  } catch (err) {
    return { error: `Error deleting restaurant: ${err}` };
  }
}