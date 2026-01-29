'use server';

import { getListIds, getList, getRestaurant, getDish } from '@/app/lib/dbFunctions';

interface ProfileItem {
  _id: string;
  name: string;
  photoUrl?: string;
  dateUpdated: Date;
  rating?: number;
  note?: string;
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
    ).filter(Boolean) as ProfileItem[];

    // Sort lists by when they were last updated
    lists.sort((a, b) => b.dateUpdated.getTime() - a.dateUpdated.getTime());

    // Only return the top 4 most recently updated lists
    return lists.slice(0, 4);
  } catch (err) {
    return [];
  }
};

export const getProfileRestaurants = async (userId: string) => {
  try {
    const listIds = await getListIds(userId);
    const restaurantIds: string[] = [];

    await Promise.all(
      listIds.map(async (listId) => {
        const list = await getList(listId);

        if (!list) return null;

        restaurantIds.push(...list.restaurants);
      })
    );

    const restaurants = (
      await Promise.all(
        restaurantIds.map(async (restaurantId) => {
          const restaurant = await getRestaurant(restaurantId);

          if (!restaurant) return null;

          return {
            _id: restaurant._id,
            name: restaurant.name,
            photoUrl: restaurant.photoUrl,
            dateUpdated: restaurant.dateUpdated,
          };
        })
      )
    ).filter(Boolean) as ProfileItem[];

    // Sort restaurants by when they were last updated
    restaurants.sort((a, b) => b.dateUpdated.getTime() - a.dateUpdated.getTime());

    // Only return the top 4 most recently updated restaurants
    return restaurants.slice(0, 4);
  } catch (err) {
    return [];
  }
}

export const getProfileReviews = async (userId: string) => {
  try {
    const listIds = await getListIds(userId);
    const restaurantIds: string[] = [];
    const dishIds: string[] = [];

    await Promise.all(
      listIds.map(async (listId) => {
        const list = await getList(listId);

        if (!list) return null;

        restaurantIds.push(...list.restaurants);
      })
    );

    await Promise.all(
      restaurantIds.map(async (restaurantId) => {
        const restaurant = await getRestaurant(restaurantId);

        if (!restaurant) return null;

        dishIds.push(...restaurant.dishes);
      })
    )

    const reviews = (
      await Promise.all(
        dishIds.map(async (dishId) => {
          const dish = await getDish(dishId);

          if (!dish) return null;

          return dish.reviews.filter(review => review.createdBy === userId).map(review => {
            return ({
              _id: review._id,
              name: dish.name,
              dateUpdated: dish.dateUpdated,
              rating: review.rating,
              note: review.note,
            })
          })
        }
        )
      )
    ).flat().filter(Boolean) as ProfileItem[];

    // Sort reviews by when they were last updated
    reviews.sort((a, b) => b.dateUpdated.getTime() - a.dateUpdated.getTime());

    // Only return the top 4 most recently updated reviews
    return reviews.slice(0, 4);
  } catch (err) {
    return [];
  }
}