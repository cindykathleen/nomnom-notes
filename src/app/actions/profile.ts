'use server';

import { getListIds, getList } from '@/app/lib/dbFunctions';

interface ProfileList {
  _id: string;
  name: string;
  photoUrl: string;
  dateUpdated: Date;
}

export const getProfileLists = async (userId: string) => {
  try {
    const listIds = await getListIds(userId);

    const lists = (
      await Promise.all(
        listIds.map(async (listId) => {
          const list = await getList(listId);

          if (!list) return null;

          return {
            _id: list._id,
            name: list.name,
            photoUrl: list.photoUrl,
            dateUpdated: list.dateUpdated,
          };
        })
      )
    ).filter(Boolean) as ProfileList[];


    // Sort lists by when they were last updated
    lists.sort((a, b) => b.dateUpdated.getTime() - a.dateUpdated.getTime());

    // Only return the top 4 most recently updated lists
    return lists.slice(0, 4);
  } catch (err) {
    return [];
  }
};