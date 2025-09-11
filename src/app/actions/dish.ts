'use server';

import { db } from '@/app/lib/database';
import { Dish, Review } from '@/app/interfaces/interfaces';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export const addDish = async (formData: FormData, userId: string, restaurantId: string, rating: number, photoId: string) => {
  const name = formData.get('dish-name') as string;
  const note = formData.get('dish-note') as string;

  const userName = await db.getUserName(userId);

  const newReview: Review = {
    _id: uuidv4(),
    createdBy: userId,
    name: userName,
    rating: rating,
    note: note
  }

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
    reviews: [newReview],
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

export const updateDish = async (formData: FormData, dishId: string, photoId: string) => {
  const name = formData.get('dish-name') as string;

  try {
    const existingDish = await db.getDish(dishId);

    if (!existingDish) {
      return { error: 'Dish not found' };
    }

    const updatedDish: Dish = {
      ...existingDish,
      name: name,
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

export const updateReview = async (formData: FormData, userId: string, dishId: string, rating: number) => {
  const note = formData.get('dish-note') as string;

  const existingDish = await db.getDish(dishId);

  if (!existingDish) {
    return { error: 'Dish not found' };
  }

  const existingReview = await db.getExistingDishReview(userId, dishId);
  let updatedReview: Review;
  let updatedReviews: Review[];

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

    updatedReviews = [...existingDish.reviews, updatedReview];
  } else {
    // Update the existing review
    updatedReview = {
      ...existingReview,
      rating: rating,
      note: note
    }

    updatedReviews = (existingDish.reviews).map((review) =>
      review.createdBy === userId ? updatedReview : review
    );
  }

  const updatedDish: Dish = {
    ...existingDish,
    reviews: updatedReviews
  };

  try {
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
    await db.moveDish(dragIndex, hoverIndex);
    revalidatePath('/restaurant');
    return { message: 'Drag & drop implemented successfully' };
  } catch (err) {
    return { error: `Error dragging & dropping items: ${err}` };
  }
}