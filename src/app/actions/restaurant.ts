'use server';

import { getExistingRestaurantReview, getUserName, getRestaurant,
  updateRestaurantDb, deleteRestaurantDb, getListByRestaurantId,
  isOwnerOrCollaboratorDb } from '@/app/lib/dbFunctions';
import { recordReviewActivity } from '@/app/lib/recordReviewActivity';
import { removeActivitiesForRestaurant } from '@/app/lib/removeActivity';
import { Restaurant, Review } from "@/app/interfaces/interfaces";
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export const updateReview = async (note: string, userId: string, restaurantId: string, rating: number) => {
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
      note: note,
      dateAdded: new Date(),
      dateUpdated: new Date(),
    }
  } else {
    // Update the existing review
    updatedReview = {
      ...existingReview,
      rating: rating,
      note: note,
      dateUpdated: new Date(),
    }
  }

  return updatedReview;
}

export const updateRestaurant = async (userId: string, restaurantId: string, updatedReview: Review) => {
  try {
    const list = await getListByRestaurantId(restaurantId);
    if (!list || !(await isOwnerOrCollaboratorDb(userId, list._id))) {
      return { error: 'Not authorized to review this restaurant' };
    }

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
    await recordReviewActivity({
      userId,
      restaurantId,
      kind: 'restaurant',
      isNewReview: !existingReview,
    });
    revalidatePath('/list');
    return { message: 'Restaurant updated successfully' };
  } catch (err) {
    return { error: `Error updating restaurant: ${err}` };
  }
}

export const deleteRestaurant = async (listId: string, restaurantId: string, userId: string) => {
  try {
    if (!(await isOwnerOrCollaboratorDb(userId, listId))) {
      return { error: 'Not authorized to remove restaurants from this list' };
    }

    await deleteRestaurantDb(listId, restaurantId);
    await removeActivitiesForRestaurant(restaurantId);
    revalidatePath('/list');
    return { message: 'Restaurant deleted successfully' };
  } catch (err) {
    return { error: `Error deleting restaurant: ${err}` };
  }
}