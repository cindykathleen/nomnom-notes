import { v4 as uuidv4 } from 'uuid';
import { ActivityItem, ActivityType } from '@/app/interfaces/interfaces';
import { addActivityDb, ensureActivityIndexes } from '@/app/lib/dbFunctions';

let indexesEnsured = false;

export type RecordActivityInput = {
  userId: string;
  type: ActivityType;
  listId?: string;
  restaurantId?: string;
  dishId?: string;
};

export async function recordActivity(input: RecordActivityInput): Promise<ActivityItem> {
  if (!indexesEnsured) {
    await ensureActivityIndexes();
    indexesEnsured = true;
  }

  const activity: ActivityItem = {
    _id: uuidv4(),
    userId: input.userId,
    type: input.type,
    createdAt: new Date(),
    ...(input.listId !== undefined && { listId: input.listId }),
    ...(input.restaurantId !== undefined && { restaurantId: input.restaurantId }),
    ...(input.dishId !== undefined && { dishId: input.dishId }),
  };

  await addActivityDb(activity);
  return activity;
}
