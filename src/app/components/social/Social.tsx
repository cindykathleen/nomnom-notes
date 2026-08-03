import { User } from '@/app/interfaces/interfaces';

/** Preserve id order; ids are expected newest-first. */
export function orderUsersByIds(users: User[], ids: string[]): User[] {
  const userMap = new Map(users.map((user) => [user._id, user]));
  return ids
    .map((id) => userMap.get(id))
    .filter((user): user is User => user !== undefined);
}

/** Most recent ids are at the end of Mongo $addToSet arrays — newest first. */
export function newestFirstIds(ids: string[]): string[] {
  return [...ids].reverse();
}
