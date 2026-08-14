'use server';

import {
  addRankingDb,
  getRanking,
  updateRankingDb,
  deleteRankingDb,
  addRestaurantToRankingDb,
  removeRestaurantFromRankingDb,
  moveRestaurantInRankingDb,
  isRankingOwnerDb,
} from '@/app/lib/dbFunctions';
import { RankingList } from '@/app/interfaces/interfaces';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export const createRankingList = async (
  userId: string,
  formData: FormData,
  photoUrl: string
) => {
  const name = formData.get('ranking-name') as string;
  const description = (formData.get('ranking-description') as string) || '';

  if (!name?.trim()) {
    return { error: 'Ranking name is required' };
  }

  const newRanking: RankingList = {
    _id: uuidv4(),
    owner: userId,
    name: name.trim(),
    description,
    photoUrl,
    restaurants: [],
    dateAdded: new Date(),
    dateUpdated: new Date(),
  };

  try {
    await addRankingDb(userId, newRanking);
    revalidatePath('/rankings');
    revalidatePath('/');
    return { message: 'Ranking added successfully', rankingId: newRanking._id };
  } catch (err) {
    return { error: `Error adding ranking: ${err}` };
  }
};

export const updateRankingList = async (
  userId: string,
  formData: FormData,
  rankingId: string,
  photoUrl: string
) => {
  const name = formData.get('ranking-name') as string;
  const description = (formData.get('ranking-description') as string) || '';

  if (!name?.trim()) {
    return { error: 'Ranking name is required' };
  }

  try {
    if (!(await isRankingOwnerDb(userId, rankingId))) {
      return { error: 'Not authorized to update this ranking' };
    }

    const existingRanking = await getRanking(rankingId);

    if (!existingRanking) {
      return { error: 'Ranking not found' };
    }

    const updatedRanking: RankingList = {
      ...existingRanking,
      name: name.trim(),
      description,
      photoUrl,
      dateUpdated: new Date(),
    };

    await updateRankingDb(updatedRanking);
    revalidatePath('/rankings');
    revalidatePath(`/rankings/${rankingId}`);
    revalidatePath('/');
    return { message: 'Ranking updated successfully' };
  } catch (err) {
    return { error: `Error updating ranking: ${err}` };
  }
};

export const deleteRankingList = async (userId: string, rankingId: string) => {
  try {
    if (!(await isRankingOwnerDb(userId, rankingId))) {
      return { error: 'Not authorized to delete this ranking' };
    }

    await deleteRankingDb(rankingId);
    revalidatePath('/rankings');
    revalidatePath('/');
    return { message: 'Ranking deleted successfully' };
  } catch (err) {
    return { error: `Error deleting ranking: ${err}` };
  }
};

export const addRestaurantToRanking = async (
  userId: string,
  rankingId: string,
  restaurantId: string
) => {
  try {
    if (!(await isRankingOwnerDb(userId, rankingId))) {
      return { error: 'Not authorized to update this ranking' };
    }

    const result = await addRestaurantToRankingDb(rankingId, restaurantId);

    if (result.error) {
      return { error: result.error };
    }

    revalidatePath('/rankings');
    revalidatePath(`/rankings/${rankingId}`);
    revalidatePath('/');
    return { message: result.message };
  } catch (err) {
    return { error: `Error adding restaurant to ranking: ${err}` };
  }
};

export const removeRestaurantFromRanking = async (
  userId: string,
  rankingId: string,
  restaurantId: string
) => {
  try {
    if (!(await isRankingOwnerDb(userId, rankingId))) {
      return { error: 'Not authorized to update this ranking' };
    }

    const result = await removeRestaurantFromRankingDb(rankingId, restaurantId);

    if (result.error) {
      return { error: result.error };
    }

    revalidatePath('/rankings');
    revalidatePath(`/rankings/${rankingId}`);
    revalidatePath('/');
    return { message: result.message };
  } catch (err) {
    return { error: `Error removing restaurant from ranking: ${err}` };
  }
};

export const moveRestaurantInRanking = async (
  userId: string,
  rankingId: string,
  dragIndex: number,
  hoverIndex: number
) => {
  try {
    if (!(await isRankingOwnerDb(userId, rankingId))) {
      return { error: 'Not authorized to update this ranking' };
    }

    await moveRestaurantInRankingDb(rankingId, dragIndex, hoverIndex);
    revalidatePath(`/rankings/${rankingId}`);
    revalidatePath('/');
    return { message: 'Restaurant ranking updated successfully' };
  } catch (err) {
    return { error: `Error moving restaurant in ranking: ${err}` };
  }
};
